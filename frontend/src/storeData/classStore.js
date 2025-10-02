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
    bookClass: async (classId, sessionDate) => {
        set({ isBooking: true });
        try {
            const { availableSessions } = get();
            
            const session = availableSessions.find(s => s.date === sessionDate);
            if (!session) {
                throw new Error('No matching session found for the selected date');
            }
            
            // ✅ FIX: Add :00 for seconds
            const payload = {
                startTime: `${session.date}T${session.startTime}:00`,  // Add :00
                endTime: `${session.date}T${session.endTime}:00`       // Add :00
            };
            
            console.log('🔍 Sending booking request:', payload);
            
            const response = await axios.post(`/user/bookings/${classId}`, payload);
            
            toast.success('Class booked successfully!');
            set({ isBooking: false });
            
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
        const sessions = [];
        
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
        
        // Generate sessions for the next 8 weeks (56 days)
        const weeksToGenerate = 8;
        
        for (let week = 0; week < weeksToGenerate; week++) {
            const sessionDate = new Date(today);
            const daysUntilTarget = (targetDay - today.getDay() + 7) % 7 || 7;
            sessionDate.setDate(today.getDate() + daysUntilTarget + (week * 7));
            
            // Only add future sessions
            if (sessionDate > today) {
                sessions.push({
                    date: sessionDate.toISOString().split('T')[0],
                    startTime: classData.timeSlot.startTime,
                    endTime: classData.timeSlot.endTime,
                    duration: classData.duration,
                    spotsLeft: classData.capacity - (classData.attendees?.length || 0),
                    sessionKey: `${sessionDate.toISOString().split('T')[0]}_${classData.timeSlot.startTime}`
                });
            }
        }
        
        set({ availableSessions: sessions });
        return sessions;
    },

    // function for recurring sessions for scheduling
    getRecurringSessionsForClass: (classData, daysAhead = 30) => {
        if (!classData || !classData.timeSlot) {
            return [];
        }
        
        const today = new Date();
        const sessions = [];
        
        const dayMap = {
            'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
            'Thursday': 4, 'Friday': 5, 'Saturday': 6
        };
        
        const targetDay = dayMap[classData.timeSlot.day];
        if (targetDay === undefined) {
            return [];
        }
        
        // Generate sessions for the specified number of days ahead
        let currentDate = new Date(today);
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + daysAhead);
        
        while (currentDate <= endDate) {
            if (currentDate.getDay() === targetDay && currentDate >= today) {
                sessions.push({
                    ...classData,
                    sessionDate: currentDate.toISOString().split('T')[0],
                    sessionKey: `${classData._id}_${currentDate.toISOString().split('T')[0]}`
                });
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return sessions;
    },

    // Clear error
    clearError: () => {
        set({ error: null });
    },

    // Clear selected class
    clearSelectedClass: () => {
        set({ selectedClass: null, availableSessions: [], error: null });
    },
    // clearing up past sessions
    cleanupPastSessions: async () => {
        try {
            await axios.delete('/admin/cleanup-past-sessions');
            console.log('Past sessions cleaned up');
        } catch (error) {
            console.error('Error cleaning up past sessions:', error);
        }
    }
}));