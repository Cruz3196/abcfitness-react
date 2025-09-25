import { create } from 'zustand';
import axios from '../api/axios';
import toast from 'react-hot-toast';

export const adminStore = create((set, get) => ({
  // State
  users: [],
  trainers: [],
  pendingTrainers: [],
  dashboardStats: null,
  isLoading: false,
  error: null,

  // Fetch all users
  fetchAllUsers: async () => {
    set({ isLoading: true });
    try {
      const { data } = await axios.get('/admin/users');
      set({ users: data, isLoading: false });
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
      set({ isLoading: false, error: error.message });
      return [];
    }
  },

  // Fetch all trainers
  fetchAllTrainers: async () => {
    set({ isLoading: true });
    try {
      const { data } = await axios.get('/admin/trainers');
      set({ trainers: data, isLoading: false });
      return data;
    } catch (error) {
      console.error('Error fetching trainers:', error);
      toast.error('Failed to fetch trainers');
      set({ isLoading: false, error: error.message });
      return [];
    }
  },

  // Fetch pending trainer profiles
  fetchPendingTrainers: async () => {
    set({ isLoading: true });
    try {
      const { data } = await axios.get('/admin/trainers/pending-profiles');
      set({ pendingTrainers: data, isLoading: false });
      return data;
    } catch (error) {
      console.error('Error fetching pending trainers:', error);
      toast.error('Failed to fetch pending trainers');
      set({ isLoading: false, error: error.message });
      return [];
    }
  },

  // Fetch dashboard statistics
  fetchDashboardStats: async () => {
    set({ isLoading: true });
    try {
      const { data } = await axios.get('/admin/dashboard/stats');
      set({ dashboardStats: data, isLoading: false });
      return data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to fetch dashboard statistics');
      set({ isLoading: false, error: error.message });
      return null;
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      await axios.delete(`/admin/users/${userId}`);
      // Update local state by removing the deleted user
      set(state => ({
        users: state.users.filter(user => user._id !== userId)
      }));
      toast.success('User deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
      return false;
    }
  },

  // Change user status (promote to trainer)
  changeUserStatus: async (userId) => {
    try {
      const { data } = await axios.put(`/admin/users/${userId}/statusChange`);
      // Update local state
      set(state => ({
        users: state.users.map(user => 
          user._id === userId ? { ...user, role: 'trainer' } : user
        )
      }));
      toast.success(data.message);
      return true;
    } catch (error) {
      console.error('Error changing user status:', error);
      toast.error('Failed to change user status');
      return false;
    }
  },

  // Clear data
  clearData: () => {
    set({
      users: [],
      trainers: [],
      pendingTrainers: [],
      dashboardStats: null,
      isLoading: false,
      error: null
    });
  }
}));