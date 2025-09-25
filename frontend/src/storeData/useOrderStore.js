import { create } from 'zustand';
import axios from '../api/axios';
import toast from 'react-hot-toast';

export const useOrderStore = create((set) => ({
  orders: [],
  isLoading: false,
  error: null,

  fetchOrderHistory: async () => {
    set({ isLoading: true });
    try {
      const { data } = await axios.get('/user/orderHistory');
      set({ orders: data, isLoading: false });
      return data;
    } catch (error) {
      console.error('Error fetching order history:', error);
      toast.error('Failed to load your order history');
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch orders' 
      });
      return [];
    }
  },

  clearOrders: () => {
    set({ orders: [], isLoading: false, error: null });
  }
}));