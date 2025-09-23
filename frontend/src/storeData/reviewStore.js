import { create } from 'zustand';
import toast from 'react-hot-toast';

// --- MOCK DATA ---
const mockReviews = {
  class1: [
    { _id: 'r1', user: { _id: 'user1', username: 'Bob Williams', profileImage: 'https://placehold.co/100x100/60a5fa/ffffff?text=B' }, rating: 5, reviewText: 'Alice is an amazing yoga instructor! The class was challenging but accessible. Highly recommended.' },
    { _id: 'r2', user: { _id: 'user2', username: 'Diana Prince', profileImage: 'https://placehold.co/100x100/c084fc/ffffff?text=D' }, rating: 4, reviewText: 'Great flow and a wonderful atmosphere. Will be back for sure.' },
  ],
};
// ---

export const reviewStore = create((set, get) => ({
  reviews: [],
  isLoading: false,

  fetchReviewsByClass: async (classId) => {
    set({ isLoading: true });
    setTimeout(() => {
      set({ reviews: mockReviews[classId] || [], isLoading: false });
    }, 500);
  },

  submitReview: async (classId, reviewData, currentUser) => {
    toast.loading('Submitting your review...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newReview = {
        _id: `r${Date.now()}`,
        user: { 
            _id: currentUser._id, 
            username: currentUser.username, 
            profileImage: currentUser.profileImage 
        },
        ...reviewData
    };

    set(state => ({ reviews: [newReview, ...state.reviews] }));
    toast.dismiss();
    toast.success('Thank you for your feedback!');
  },

  updateReview: async (reviewId, updateData) => {
    toast.loading('Updating review...');
    await new Promise(resolve => setTimeout(resolve, 700));
    set(state => ({
        reviews: state.reviews.map(review => 
            review._id === reviewId ? { ...review, ...updateData } : review
        )
    }));
    toast.dismiss();
    toast.success('Review updated!');
  },

  deleteReview: async (reviewId) => {
    toast.loading('Deleting review...');
    await new Promise(resolve => setTimeout(resolve, 700));
    set(state => ({
        reviews: state.reviews.filter(review => review._id !== reviewId)
    }));
    toast.dismiss();
    toast.success('Review deleted.');
  },
}));

