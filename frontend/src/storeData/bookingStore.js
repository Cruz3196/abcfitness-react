import { create } from 'zustand';
import api from '../api/axios';
import toast from 'react-hot-toast';

// MOCK DATA for initial UI building
const mockBookings = {
    upcoming: [
        { _id: 'b1', class: { _id: 'c1', classTitle: 'Vinyasa Flow Yoga', classPic: 'https://placehold.co/100x100/6D28D9/FFFFFF?text=Yoga' }, startTime: new Date(Date.now() + 86400000 * 2), status: 'upcoming' },
        { _id: 'b2', class: { _id: 'c2', classTitle: 'Advanced CrossFit', classPic: 'https://placehold.co/100x100/BE123C/FFFFFF?text=CrossFit' }, startTime: new Date(Date.now() + 86400000 * 5), status: 'upcoming' }
    ],
    history: [
        { _id: 'b3', class: { _id: 'c3', classTitle: 'HIIT Cardio Blast', classPic: 'https://placehold.co/100x100/047857/FFFFFF?text=HIIT' }, startTime: new Date(Date.now() - 86400000 * 7), status: 'completed' },
        { _id: 'b4', class: { _id: 'c4', classTitle: 'Beginner Boxing', classPic: 'https://placehold.co/100x100/FACC15/000000?text=Boxing' }, startTime: new Date(Date.now() + 86400000 * 3), status: 'cancelled' }
    ]
};

export const bookingStore = create((set, get) => ({
  upcomingBookings: [],
  bookingHistory: [],
  isLoading: false,

  fetchMyBookings: async () => {
    set({ isLoading: true });
    // MOCK IMPLEMENTATION
    setTimeout(() => {
        set({
            upcomingBookings: mockBookings.upcoming,
            bookingHistory: mockBookings.history,
            isLoading: false,
        });
    }, 500);

    /* // LIVE API CODE
    try {
      const { data } = await api.get('/users/my-bookings');
      set({
        upcomingBookings: data.upcoming || [],
        bookingHistory: data.history || [],
        isLoading: false,
      });
    } catch (error) {
      toast.error("Failed to fetch your bookings.");
      set({ isLoading: false });
    }
    */
  },

  cancelBooking: async (bookingId) => {
    set({ isLoading: true });
    toast.loading('Cancelling booking...');
    
    // MOCK IMPLEMENTATION
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.dismiss();
    toast.success('Booking cancelled successfully.');
    
    // In a real app, we would refetch the bookings after cancellation
    get().fetchMyBookings();
    set({ isLoading: false });
  },
}));

