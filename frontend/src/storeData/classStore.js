import { create } from 'zustand';
import axios from '../api/axios';
import toast from 'react-hot-toast';

export const classStore = create((set, get) => ({
    classes: [],
    selectedClass: null,
    availableSessions: [],
    isLoading: true,
    isBooking: false,
    error: null,

    // Fetch all available classes for customers
    fetchAllClasses: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get('/user/ourClasses');
            set({ 
                classes: response.data.classes || response.data, 
                isLoading: false 
            });
        } catch (error) {
            console.error("Error fetching classes:", error);
            set({ 
                isLoading: false, 
                error: error.response?.data?.message || "Failed to fetch classes",
                classes: []
            });
        }
    },

    // Gets a single class by its ID
    fetchClassById: async (classId) => {
        set({ isLoading: true, selectedClass: null, error: null });
        try {
            const existingClass = get().classes.find(c => c._id === classId);
            
            if (existingClass) {
                set({ selectedClass: existingClass, isLoading: false });
                get().generateAvailableSessions(existingClass);
                return;
            }

            // Try the public route first, then fallback to trainer route
            let response;
            try {
                response = await axios.get(`/trainer/viewClass/${classId}`);
            } catch (error) {
                console.error("Error fetching class from trainer route:", error);
                set({ isLoading: false, error: "Failed to fetch class details" });
                return;
            }
            
            const classData = response.data;
            set({ selectedClass: classData, isLoading: false });
            get().generateAvailableSessions(classData);
            
        } catch (error) {
            console.error("Error fetching class by ID:", error);
            set({ 
                isLoading: false, 
                error: error.response?.data?.error || error.response?.data?.message || "Failed to fetch class details" 
            });
        }
    },

    // ✅ ADD: Book a class function
    bookClass: async (classId, sessionDate) => {
        set({ isBooking: true });
        try {
            const response = await axios.post(`/user/bookings/${classId}`, { 
                date: sessionDate 
            });
            
            toast.success('Class booked successfully!');
            set({ isBooking: false });
            
            // Return the booking data for the modal
            return {
                success: true,
                booking: response.data.booking,
                sessionDate: response.data.sessionDate
            };
        } catch (error) {
            console.error("Book class error:", error);
            toast.error(error.response?.data?.message || 'Failed to book class');
            set({ isBooking: false });
            return { success: false };
        }
    },

    // Generate available sessions for the next 4 weeks
    generateAvailableSessions: (classData) => {
        if (!classData || !classData.timeSlot) {
            set({ availableSessions: [] });
            return;
        }

        const sessions = [];
        const today = new Date();
        
        // Generate sessions for the next 4 weeks
        for (let i = 0; i < 28; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            
            if (dayName === classData.timeSlot.day) {
                const spotsLeft = Math.max(0, classData.capacity - (classData.attendees?.length || 0));
                
                sessions.push({
                    date: date.toISOString().split('T')[0],
                    startTime: classData.timeSlot.startTime,
                    endTime: classData.timeSlot.endTime,
                    duration: classData.duration,
                    spotsLeft: spotsLeft
                });
            }
        }

        set({ availableSessions: sessions });
    },

    // Clear error
    clearError: () => {
        set({ error: null });
    },

    // Clear selected class
    clearSelectedClass: () => {
        set({ selectedClass: null, availableSessions: [], error: null });
    }
}));