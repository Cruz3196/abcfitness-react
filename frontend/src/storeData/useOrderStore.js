import { create } from 'zustand';
import api from '../api/axios';
import toast from 'react-hot-toast';

export const useOrderStore = create((set) => ({
    orders: [],
    isLoading: false,
    error: null,

    fetchOrderHistory: async () => {
            set({ isLoading: true, error: null });
        try {
        // This corresponds to the GET /api/users/orders endpoint we just built
        const { data } = await api.get('/users/orders');
            set({ orders: data, isLoading: false });
        } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to fetch order history.";
            set({ error: errorMessage, isLoading: false, orders: [] });
            toast.error(errorMessage);
        }
    },
}));
