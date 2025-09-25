import { create } from 'zustand';
import { userStore } from './userStore';
import axios from "../api/axios";
import toast from 'react-hot-toast';


export const bookingStore = create((set, get) => ({
  upcomingBookings: [],
  bookingHistory: [],
  isLoading: false,

  fetchMyBookings: async () => {
    set({ isLoading: true });

    try {
      const {data } = await axios.get("/user/bookings");
      // Assuming the response structure contains 'upcoming' and 'booking' arrays
      set({
        upcomingBookings: data.upcoming || [],
        bookingHistory: data.booking || [],
        isLoading: false
      });
    } catch (error) {
      console.error("Error fetching bookings", error);
      toast.error("Failed to fetch bookings");
    }
  },

  cancelBooking: async (bookingId) => {
    set({ isLoading: true });
    toast.loading('Cancelling booking...');
    
    try {
      await axios.delete(`/user/bookings/${bookingId}`);
      toast.dismiss();
      toast.success('Booking cancelled successfully.');
      
      // Refresh bookings after cancellation
      await get().fetchMyBookings();
    } catch (error) {
        toast.dismiss();
        toast.error(error.response?.data?.message || 'Failed to cancel booking');
        set({ isLoading: false });
    }
  },
}));

