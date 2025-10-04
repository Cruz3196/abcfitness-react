import { create } from "zustand";
import axios from "../api/axios";
import toast from "react-hot-toast";

export const userStore = create((set, get) => ({
    user: null,
    bookings: [],
    isCheckingAuth: true, // ✅ Start as true
    isLoading: false,
    selectedClass: null,
    error: null,
    bookingsLoaded: false,
    isAuthenticated: false,

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
    signup: async ({ username, email, password }) => {
        set({ isLoading: true });
        try {
            const res = await axios.post("/user/signup", { username, email, password });
            
            // ✅ Set the user state immediately after signup
            set({ 
                user: res.data.user,
                isAuthenticated: true,
                isLoading: false 
            });
            
            return true;
        } catch (error) {
            set({ isLoading: false });
            toast.error(error.response?.data?.message || "An error occurred");
            return false;
        }
    },

    login: async (email, password) => {
        const state = get();
        
        // ✅ Prevent double login
        if (state.isLoading) {
            console.log('🔄 Login already in progress');
            return false;
        }
        
        set({ isLoading: true });
        try {
            const res = await axios.post("/user/login", { email, password });
            
            set({ 
                user: res.data, 
                isLoading: false,
                isAuthenticated: true
            });
            
            toast.success(`Welcome back, ${res.data.username}!`);
            return res.data;
        } catch (error) {
            set({ isLoading: false });
            toast.error(error.response?.data?.message || "Login failed");
            return false;
        }
    },

    logout: async () => {
        const state = get();
        
        // ✅ Prevent double logout
        if (!state.user && !state.isAuthenticated) {
            console.log('🚫 Already logged out');
            return true;
        }
        
        try {
            await axios.post("/user/logout");
        } catch (error) {
            console.log('❌ Logout request failed, but clearing state anyway');
        }
        
        // ✅ Always clear state
        set({ 
            user: null,
            isAuthenticated: false
        });
        
        toast.success('Logged out successfully');
        return true;
    },

    deleteUserAccount: async () => {
        try {
            const response = await axios.delete('/user/deleteAccount');
            
            // Clear user state
            set({ 
                user: null, 
                isAuthenticated: false 
            });
            
            return response.data;
        } catch (error) {
            console.error('Delete account error:', error);
            throw error;
        }
    },
    
    // Check if user is authenticated on app load
    checkAuthStatus: async () => {
        console.log('🔍 Starting auth check...');
        set({ isCheckingAuth: true });
        
        try {
            console.log('📡 Making request to /user/profile...');
            const response = await axios.get("/user/profile");
            console.log('✅ Auth check successful:', response.data);
            
            set({ 
                user: response.data, 
                isCheckingAuth: false,
                isAuthenticated: true
            });
        } catch (error) {
            console.log('❌ Auth check failed:', error.response?.status, error.message);
            
            set({ 
                isCheckingAuth: false, 
                user: null,
                isAuthenticated: false
            });
            
            // ✅ Don't throw error - just log it
            console.log('🚫 User not authenticated - this is normal for first visit');
        }
    },

    refreshToken: async () => {
        const currentState = get();
        
        console.log('🔄 Refresh token attempt:', {
            hasUser: !!currentState.user,
            isAuthenticated: currentState.isAuthenticated,
            isCheckingAuth: currentState.isCheckingAuth
        });

        // ✅ Don't try to refresh if we don't have a user
        if (!currentState.user && !currentState.isAuthenticated) {
            console.log('🚫 No user to refresh token for');
            throw new Error('No authenticated user');
        }

        if (currentState.isCheckingAuth) {
            console.log('🔄 Already checking auth, skipping refresh');
            return;
        }

        set({ isCheckingAuth: true });
        try {
            console.log('📡 Refreshing token...');
            const response = await axios.post("/user/refresh-token");
            
            set({ isCheckingAuth: false });
            console.log('✅ Token refreshed successfully');
            return response.data;
        } catch (error) {
            console.log('❌ Token refresh failed:', error.response?.status);
            
            set({ 
                user: null, 
                isCheckingAuth: false,
                isAuthenticated: false
            });
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
            // ✅ Send classDescription instead of description to match your backend schema
            const sanitizedClassData = {
                classTitle: classData.classTitle,
                classDescription: classData.classDescription || "", // ✅ Keep as classDescription
                classType: classData.classType || "General",
                duration: classData.duration || 60,
                timeSlot: classData.timeSlot,
                classPic: classData.classPic || "",
                capacity: classData.capacity || 10,
                price: classData.price || 0
            };
            
            console.log('📤 Sending class data:', sanitizedClassData);
            
            const response = await axios.post("/trainer/createClass", sanitizedClassData);
            
            await get().fetchMyClasses(); 
            
            toast.success("Class created successfully!");
            set({ isLoading: false });
            return true;
        } catch (error) {
            console.error("Create class error:", error);
            console.error("Error response:", error.response?.data);
            set({ isLoading: false });
            
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

    // BOOKINGS ACTIONS=====================================================

    // ✅ IMPROVED: Fetch bookings with better caching
    fetchMyBookings: async (forceRefresh = false) => {
        const { bookings, isLoading } = get();
        
        if (isLoading || (bookings.length > 0 && !forceRefresh)) {
            console.log('📚 Using cached bookings or already loading');
            return;
        }

        try {
            console.log('🔄 Fetching bookings from API...');
            set({ isLoading: true });
            
            const response = await axios.get('/user/bookings');
            const fetchedBookings = response.data.bookings || [];
            
            // ✅ Deduplicate by booking _id
            const uniqueBookings = Array.from(
                new Map(fetchedBookings.map(booking => [booking._id, booking])).values()
            );
            
            set({ 
                bookings: uniqueBookings,
                isLoading: false 
            });
            
            console.log('✅ Bookings loaded:', uniqueBookings.length);
        } catch (error) {
            console.error('❌ Error fetching bookings:', error);
            set({ 
                bookings: [],
                isLoading: false,
                error: error.response?.data?.message || 'Failed to fetch bookings'
            });
        }
    },

// Replace the cancelBooking function:
    cancelBooking: async (bookingId) => {
        try {
            console.log('🔍 Cancelling booking:', bookingId);
            
            const response = await axios.delete(`/user/cancelBooking/${bookingId}`);
            
            // ✅ Remove from local state immediately
            const { bookings } = get();
            const updatedBookings = bookings.filter(booking => booking._id !== bookingId);
            set({ bookings: updatedBookings });
            
            console.log('✅ Booking removed from local state');
            toast.success('Booking cancelled successfully!');
            return { success: true };
            
        } catch (error) {
            console.error('❌ Cancel booking error:', error);
            toast.error(error.response?.data?.message || 'Failed to cancel booking');
            return { success: false };
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
    
    console.log('🚨 Axios interceptor caught error:', {
      status: error.response?.status,
      url: originalRequest?.url,
      retry: originalRequest?._retry
    });

    // ✅ ONLY skip refresh for auth endpoints
    const skipRefreshUrls = ['/login', '/signup', '/refresh-token', '/logout'];
    const shouldSkipRefresh = skipRefreshUrls.some(url =>
      originalRequest?.url?.includes(url)
    );

    if (shouldSkipRefresh) {
      console.log('🚫 Skipping refresh for:', originalRequest?.url);
      return Promise.reject(error);
    }

    // ✅ Handle 401 errors with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // ✅ Check if we're already refreshing
        if (refreshPromise) {
          console.log('⏳ Waiting for existing refresh...');
          await refreshPromise;
        } else {
          console.log('🔄 Starting token refresh...');
          refreshPromise = axios.post('/api/auth/refresh-token', {}, {
            withCredentials: true
          });
          
          await refreshPromise;
          console.log('✅ Token refreshed successfully');
          refreshPromise = null;
        }

        // ✅ Retry the original request
        console.log('✅ Retrying original request...');
        return axios(originalRequest);

      } catch (refreshError) {
        console.log('❌ Token refresh failed:', refreshError);
        refreshPromise = null;
        
        // ✅ Only logout if refresh actually failed (not network error)
        if (refreshError.response?.status === 401) {
          userStore.getState().logout();
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);