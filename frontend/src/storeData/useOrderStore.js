import { create } from 'zustand';
import axios from '../api/axios';
import toast from 'react-hot-toast';

export const useOrderStore = create((set, get) => ({
    orders: [],
    isLoading: false,
    error: null,

    // Fetch user's order history
    fetchOrderHistory: async () => {
        try {
            set({ isLoading: true, error: null });
            const response = await axios.get('/user/orderHistory'); 
            
            if (response.data.success) {
                set({ 
                    orders: response.data.orders || [],
                    isLoading: false 
                });
            } else {
                set({ 
                    orders: [],
                    isLoading: false,
                    error: 'Failed to fetch orders'
                });
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            set({ 
                orders: [],
                isLoading: false,
                error: error.response?.data?.message || 'Failed to fetch order history'
            });
            toast.error('Failed to load your order history');
        }
    },

    // Fetch detailed info for a specific order by ID
    fetchOrderById: async (orderId) => {
        try {
            set({ isLoading: true, error: null });
            
            console.log('Fetching order details for:', orderId);
            const response = await axios.get(`/user/orders/${orderId}`);
            
            if (response.data.success) {
                return response.data.order;
            } else {
                throw new Error('Order not found');
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
            set({ 
                isLoading: false,
                error: error.response?.data?.message || 'Failed to fetch order details'
            });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // Add a new order to the store (called after successful purchase)
    addOrder: (newOrder) => {
        set((state) => ({
            orders: [newOrder, ...state.orders] // Add new order at the beginning
        }));
    },

    // Clear orders (for logout)
    clearOrders: () => {
        set({ orders: [], error: null });
    },

    // Get order by ID from store
    getOrderById: (orderId) => {
        const { orders } = get();
        return orders.find(order => order._id === orderId);
    },
}));