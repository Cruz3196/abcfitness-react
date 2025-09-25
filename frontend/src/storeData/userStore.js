import { create } from "zustand";
import axios from "../api/axios";
import toast from "react-hot-toast";

export const userStore = create((set, get) => ({
    user: null,
    isCheckingAuth: true,
    isLoading: false,
    selectedClass: null, // New state for selected class

    // ROLE CHECKERS =============================================================
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

    // Check if trainer needs profile setup
    needsTrainerSetup: () => {
        const user = get().user;
        return user && user.role === 'trainer' && !user.hasTrainerProfile;
    },

    // AUTHENTICATION ACTIONS=====================================================
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
            return res.data; // Return user data for redirect logic
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


    // TRAINERS ONLY FUNCTIONS =====================================================
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

    // Create trainer profile
    createTrainerProfile: async (trainerData) => {
        set({ isLoading: true });
        try {
            await axios.post("/trainer/creatingTrainerProfile", trainerData);
            
            // ✅ IMPROVEMENT: Instead of manually updating the user object,
            // just call checkAuthStatus again. This will refetch the
            // complete, updated user profile from the server, which now includes
            // the full trainerProfile object.
            await get().checkAuthStatus(); 
            
            toast.success("Trainer profile created successfully");
            set({ isLoading: false });
            return true;
        } catch (error) {
            set({ isLoading: false });
            toast.error(error.response?.data?.message || "Failed to create trainer profile");
            return false;
        }
    },

    // updating the trainers profile information 
    updateTrainerProfile: async (updatedData) => {
        set({ isLoading: true });
        try {
            // 1. Make the PUT request to your backend endpoint
            const response = await axios.put("/trainer/updatingTrainerProfile", updatedData);
            
            // 2. Refresh the user's entire profile to ensure state is in sync
            await get().checkAuthStatus(); 
            
            toast.success(response.data.message || "Profile updated successfully!");
            set({ isLoading: false });
            return true; // Return true on success
        } catch (error) {
            set({ isLoading: false });
            toast.error(error.response?.data?.message || "Failed to update profile");
            return false; // Return false on failure
        }
    },

    // once the trainer is logged can create classes 
    createClass: async (classData) => {
        set({ isLoading: true });
        try {
            
            await axios.post("/trainer/createClass", classData);
            
            // ✅ CRITICAL CHANGE: Instead of checkAuthStatus, call our new function
            // This ensures we get the fresh list of classes, including the new one.
            await get().fetchMyClasses(); 
            
            toast.success("Class created successfully!");
            // No need to set isLoading to false here, fetchMyClasses will do it.
            return true;
        } catch (error) {
            console.error("Create class error:", error);
            set({ isLoading: false }); // Set loading false on error
            
            if (error.response?.data?.details) {
                const validationErrors = error.response.data.details;
                const errorMessages = validationErrors.map(err => `${err.field}: ${err.message}`).join(', ');
                toast.error(`Validation Error: ${errorMessages}`);
            } else {
                toast.error(error.response?.data?.message || error.response?.data?.error || "Failed to create class");
            }
            return false;
        }
    },

    // fethcing all the classes created by the trainer
    fetchMyClasses: async () => {
        set({ isLoading: true });
        try {
            // This endpoint is from your router: router.get("/viewMyClasses", ...)
            const response = await axios.get("/trainer/viewMyClasses");
            
            // Update the 'user' object in the store with the fetched classes
            set(state => ({
                user: { ...state.user, classes: response.data },
                isLoading: false
            }));
            
        } catch (error) {
            console.error("Fetch my classes error:", error);
            toast.error("Could not load your classes.");
            set({ isLoading: false });
        }
    },

    // selecting a class from a trainer classes tab 
    fetchClassById: async (classId) => {
        set({ isLoading: true, selectedClass: null }); // Reset on new fetch
        try {
            // Note: The public route for viewing a class might be different, e.g., /api/classes/:classId
            // Adjust the URL to match your backend router setup.
            const response = await axios.get(`/trainer/viewClass/${classId}`); 
            set({
                selectedClass: response.data,
                isLoading: false
            });
        } catch (error) {
            console.error("Fetch class by ID error:", error);
            toast.error(error.response?.data?.message || "Could not load class details.");
            set({ isLoading: false });
        }
    },

    // updating a class by the trainer
    updateClass: async (classId, classData) => {
        set({ isLoading: true });
        try {
            const response = await axios.put(`/trainer/updatingClass/${classId}`, classData);
            
            // Update the selectedClass if it's the one being edited
            const currentSelectedClass = get().selectedClass;
            if (currentSelectedClass && currentSelectedClass._id === classId) {
                set({ selectedClass: response.data.class });
            }
            
            toast.success(response.data.message || "Class updated successfully!");
            set({ isLoading: false });
            return true;
        } catch (error) {
            console.error("Update class error:", error);
            set({ isLoading: false });
            
            if (error.response?.data?.details) {
                toast.error(`Error: ${error.response.data.details}`);
            } else {
                toast.error(error.response?.data?.error || error.response?.data?.message || "Failed to update class");
            }
            return false;
        }
    },

    // deleting a class by the trainer
    deleteClass: async (classId) => {
        set({ isLoading: true });
        try {
            const response = await axios.delete(`/trainer/deletingClass/${classId}`);
            
            // Clear selectedClass if it's the one being deleted
            const currentSelectedClass = get().selectedClass;
            if (currentSelectedClass && currentSelectedClass._id === classId) {
                set({ selectedClass: null });
            }
            
            toast.success(response.data.message || "Class deleted successfully!");
            set({ isLoading: false });
            return true;
        } catch (error) {
            console.error("Delete class error:", error);
            set({ isLoading: false });
            toast.error(error.response?.data?.error || error.response?.data?.message || "Failed to delete class");
            return false;
        }
    },

    // Optional: Action to clear the selected class when leaving the page
    clearSelectedClass: () => {
        set({ selectedClass: null });
    }
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