import { create } from "zustand";
import axios from "../api/axios";
import toast from "react-hot-toast";

export const userStore = create((set, get) => ({
    user: null,
    isCheckingAuth: true,
    isLoading: false,

    isAdmin: () => {
        const user = get().user;
        return user && user.role === 'admin';
    },

    isTrainer: () => {
        const user = get().user;
        return user && user.role === 'trainer';
    },

    isCustomer: () => {
        const user = get().user;
        return user && user.role === 'customer';
    },

    signup: async ({ username, email, password, confirmPassword }) => {
        set({ isLoading: true });

        try {
            const res = await axios.post("/user/signup", { username, email, password });
                set({ isLoading: false });
            return true;
        } catch (error) {
            set({ isLoading: false });
            toast.error(error.response?.data?.message || "An error occurred");
            return false;
        }
    },

    login: async (email, password) => {
        set({ isLoading: true });

        try {
            const res = await axios.post("/user/login", { email, password }, {
                timeout: 5000, // 5 seconds timeout
            });
            set({ user: res.data, isLoading: false });
            return true; // Return success
        } catch (error) {
            set({ isLoading: false });
            toast.error(error.response?.data?.message || "An error occurred");
            return false; // Return failure
        }
    },

    logout: async () => {
        try {
            await axios.post("/user/logout");
            set({ user: null });
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred during logout");
            return false;
        }
    },

    // updating the profile information
    updateProfile: async (userData) => {
        set({ isLoading: true });
        try {
            const response = await axios.put("/user/updateProfile", userData);
            // Fix: Set the user state with response.data.user instead of response.data
            set({ user: response.data.user, isLoading: false });
            toast.success(response.data.message || "Profile updated successfully");
            return true;
        } catch (error) {
            set({ isLoading: false });
            toast.error(error.response?.data?.message || "Failed to update profile");
            return false;
        }
    },

    deleteUserAccount: async () => {
        set({ isLoading: true });
        try {
            const response = await axios.delete("/user/deleteAccount");
            set({ user: null, isLoading: false });
            toast.success(response.data.message || "Account deleted successfully");
            return true;
        } catch (error) {
            set({ isLoading: false });
            toast.error(error.response?.data?.message || "Failed to delete account");
            return false;
        }
    },

    checkAuthStatus: async () => {
        set({ isCheckingAuth: true });
        try {
            const response = await axios.get("/user/profile");
            set({ user: response.data, isCheckingAuth: false });
        } catch (error) {
            console.log(error.message);
            set({ isCheckingAuth: false, user: null });
        }
    },

    refreshToken: async () => {
        // Prevent multiple simultaneous refresh attempts
        if (get().isCheckingAuth) return;

        set({ isCheckingAuth: true });
        try {
            const response = await axios.post("/user/refresh-token");
            set({ isCheckingAuth: false });
            return response.data;
        } catch (error) {
            set({ user: null, isCheckingAuth: false });
            throw error;
        }
    },

    // Clear user data (useful for debugging)
    clearUser: () => {
        set({ user: null, isCheckingAuth: false, isLoading: false });
    },

    forgotPassword: async (email) => {
        set({ isLoading: true });
        try {
            const { data } = await axios.post("/user/forgotPassword", { email });
            toast.success(data.message);
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send reset link.");
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    resetPassword: async (token, password) => {
        set({ isLoading: true });
        try {
            const { data } = await axios.put(`/user/resetPassword/${token}`, { password });
            toast.success(data.message);
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password.");
            return false;
        } finally {
            set({ isLoading: false });
        }
    },
}));

// --- Axios Interceptor for Token Refresh ---
let refreshPromise = null;

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // If a refresh is already in progress, wait for it to complete
                if (refreshPromise) {
                    await refreshPromise;
                    return axios(originalRequest);
                }

                // Start a new refresh process
                refreshPromise = userStore.getState().refreshToken();
                await refreshPromise;
                refreshPromise = null;

                return axios(originalRequest);
            } catch (refreshError) {
                // If refresh fails, redirect to login or handle as needed
                userStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);