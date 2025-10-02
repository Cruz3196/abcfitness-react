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
                // ✅ FIX: Call generateAvailableSessions properly
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
            // ✅ FIX: Call generateAvailableSessions properly
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
    // Book a class
    bookClass: async (classId, sessionDate) => {
        set({ isBooking: true });
        try {
            // Get the available sessions for the selected class
            const { availableSessions } = get();
            
            // Find the matching session
            const session = availableSessions.find(s => s.date === sessionDate);
            if (!session) {
                throw new Error('No matching session found for the selected date');
            }
            
            // Prepare the payload: startTime and endTime (combine date + time into ISO strings)
            const payload = {
                startTime: `${session.date}T${session.startTime}`,  // e.g., "2023-10-01T10:00:00"
                endTime: `${session.date}T${session.endTime}`       // e.g., "2023-10-01T11:00:00"
            };
            
            console.log('🔍 Sending booking request:', { classId, ...payload });
            
            // The route is /user/bookings/${classId}, which matches the backend
            const response = await axios.post(`/user/bookings/${classId}`, payload);
            
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



    // ✅ ADD: Function to add a new class to the store immediately
    addClassToStore: (newClass) => {
        const currentClasses = get().classes;
        set({ classes: [...currentClasses, newClass] });
    },

    // ✅ ADD: Function to update a class in the store
    updateClassInStore: (updatedClass) => {
        const currentClasses = get().classes;
        const updatedClasses = currentClasses.map(cls => 
            cls._id === updatedClass._id ? updatedClass : cls
        );
        set({ classes: updatedClasses });
    },

    // ✅ ADD: Function to remove a class from the store
    removeClassFromStore: (classId) => {
        const currentClasses = get().classes;
        const filteredClasses = currentClasses.filter(cls => cls._id !== classId);
        set({ classes: filteredClasses });
    },

    // Generate available sessions for the next 4 weeks
    generateAvailableSessions: (classData) => {
        if (!classData || !classData.timeSlot) {
            set({ availableSessions: [] });
            return [];
        }
        
        const today = new Date();
        const nextDate = new Date(today);
        
        // Find next occurrence of the class day
        const dayMap = {
            'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
            'Thursday': 4, 'Friday': 5, 'Saturday': 6
        };
        
        const targetDay = dayMap[classData.timeSlot.day];
        if (targetDay === undefined) {
            set({ availableSessions: [] });
            return [];
        }
        
        const daysUntilTarget = (targetDay - today.getDay() + 7) % 7 || 7;
        nextDate.setDate(today.getDate() + daysUntilTarget);
        
        // ✅ ONLY RETURN ONE SESSION
        const sessions = [{
            date: nextDate.toISOString().split('T')[0],
            startTime: classData.timeSlot.startTime,
            endTime: classData.timeSlot.endTime,
            duration: classData.duration,
            spotsLeft: classData.capacity - (classData.attendees?.length || 0),
            sessionKey: `${nextDate.toISOString().split('T')[0]}_${classData.timeSlot.startTime}`
        }];
        
        // ✅ FIX: Update the store state
        set({ availableSessions: sessions });
        return sessions;
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