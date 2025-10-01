import { create } from 'zustand';
import toast from 'react-hot-toast';


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

