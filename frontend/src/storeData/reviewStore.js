import { create } from 'zustand';
import axios from '../api/axios';
import toast from 'react-hot-toast';

export const reviewStore = create((set, get) => ({
  reviews: [],
  isLoading: false,
  isSubmitting: false,
  error: null,

  // Fetch all reviews for a specific class
  fetchReviewsByClass: async (classId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`/user/feedback/${classId}`);
      set({ 
        reviews: response.data || [], 
        isLoading: false 
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch reviews';
      set({ 
        isLoading: false, 
        error: errorMessage,
        reviews: [] 
      });
      toast.error(errorMessage);
      return [];
    }
  },

  // Submit a new review
  submitReview: async (classId, reviewData) => {
    set({ isSubmitting: true });
    try {
      const response = await axios.post(`/user/submitFeedback/${classId}`, reviewData);
      
      // Add the new review to the beginning of the reviews array
      const newReview = response.data.review;
      set(state => ({ 
        reviews: [newReview, ...state.reviews],
        isSubmitting: false 
      }));
      
      toast.success(response.data.message || 'Thank you for your feedback!');
      return { success: true, review: newReview };
    } catch (error) {
      console.error("Error submitting review:", error);
      const errorMessage = error.response?.data?.message || 'Failed to submit review';
      set({ isSubmitting: false });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Update an existing review
  updateReview: async (reviewId, updateData) => {
    set({ isSubmitting: true });
    try {
      const response = await axios.put(`/user/updateFeedback/${reviewId}`, updateData);
      
      // Update the review in the store
      set(state => ({
        reviews: state.reviews.map(review => 
          review._id === reviewId 
            ? { ...review, ...updateData, updatedAt: new Date().toISOString() }
            : review
        ),
        isSubmitting: false
      }));
      
      toast.success(response.data.message || 'Review updated successfully!');
      return { success: true };
    } catch (error) {
      console.error("Error updating review:", error);
      const errorMessage = error.response?.data?.message || 'Failed to update review';
      set({ isSubmitting: false });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    set({ isSubmitting: true });
    try {
      const response = await axios.delete(`/user/deleteFeedback/${reviewId}`);
      
      // Remove the review from the store
      set(state => ({
        reviews: state.reviews.filter(review => review._id !== reviewId),
        isSubmitting: false
      }));
      
      toast.success(response.data.message || 'Review deleted successfully');
      return { success: true };
    } catch (error) {
      console.error("Error deleting review:", error);
      const errorMessage = error.response?.data?.message || 'Failed to delete review';
      set({ isSubmitting: false });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Clear reviews (useful when navigating away from a class)
  clearReviews: () => {
    set({ reviews: [], error: null });
  },

  // Clear error state
  clearError: () => {
    set({ error: null });
  },

  // Add a review to the store (useful for real-time updates)
  addReviewToStore: (review) => {
    set(state => ({
      reviews: [review, ...state.reviews]
    }));
  },

  // Update a review in the store (useful for real-time updates)
  updateReviewInStore: (reviewId, updateData) => {
    set(state => ({
      reviews: state.reviews.map(review => 
        review._id === reviewId 
          ? { ...review, ...updateData }
          : review
      )
    }));
  },

  // Remove a review from the store (useful for real-time updates)
  removeReviewFromStore: (reviewId) => {
    set(state => ({
      reviews: state.reviews.filter(review => review._id !== reviewId)
    }));
  }
}));