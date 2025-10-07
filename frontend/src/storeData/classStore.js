import { create } from 'zustand';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { userStore } from './userStore';

export const classStore = create((set, get) => ({
    classes: [],
    selectedClass: null,
    availableSessions: [],
    isLoading: false,
    isBooking: false,
    error: null,

    // Fetch all available classes for customers
    fetchAllClasses: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get('/user/ourClasses');
            const classesData = response.data.classes || response.data;
            set({ 
                classes: Array.isArray(classesData) ? classesData : [], 
                isLoading: false 
            });
        } catch (error) {
            console.error("Error fetching classes:", error);
            const errorMessage = error.response?.data?.message || "Failed to fetch classes";
            set({ 
                isLoading: false, 
                error: errorMessage,
                classes: []
            });
            toast.error(errorMessage);
        }
    },

    // Gets a single class by its ID
    fetchClassById: async (classId) => {
        set({ isLoading: true, selectedClass: null, availableSessions: [], error: null });
        try {
            // Check if we already have this class in our store
            const existingClass = get().classes.find(c => c._id === classId);
            
            if (existingClass) {
                set({ selectedClass: existingClass, isLoading: false });
                get().generateAvailableSessions(existingClass);
                return existingClass;
            }

            // Fetch from API - try both routes
            let response;
            let classData;
            
            try {
                // Try public route first
                response = await axios.get(`/user/classes/${classId}`);
                classData = response.data;
            } catch (publicError) {
                // Fallback to trainer route
                try {
                    response = await axios.get(`/trainer/viewClass/${classId}`);
                    classData = response.data;
                } catch (trainerError) {
                    throw new Error('Class not found in either public or trainer routes');
                }
            }
            
            set({ selectedClass: classData, isLoading: false });
            get().generateAvailableSessions(classData);
            return classData;
            
        } catch (error) {
            console.error("Error fetching class by ID:", error);
            const errorMessage = error.response?.data?.error || 
                                error.response?.data?.message || 
                                error.message ||
                                "Failed to fetch class details";
            set({ 
                isLoading: false, 
                error: errorMessage 
            });
            toast.error(errorMessage);
            return null;
        }
    },

    // Book a class with optional session selection
bookClass: async (classId, sessionIndex = 0) => {
    set({ isBooking: true });
    try {
        const { availableSessions } = get();
        
        const session = availableSessions[sessionIndex];
        if (!session) {
            throw new Error('No available sessions found');
        }
        
        const payload = {
            startTime: `${session.date}T${session.startTime}`,
            endTime: `${session.date}T${session.endTime}`
        };
        
        const response = await axios.post(`/user/bookings/${classId}`, payload);
        
        const { fetchMyBookings } = userStore.getState();
        await fetchMyBookings(true); // Force refresh to get latest from server
        
        toast.success('Class booked successfully!');
        set({ isBooking: false });
        
        return {
            success: true,
            booking: response.data.booking
        };
    } catch (error) {
        console.error("Book class error:", error);
        toast.error(error.response?.data?.message || 'Failed to book class');
        set({ isBooking: false });
        return { success: false };
    }
},

    // Add a new class to the store immediately
    addClassToStore: (newClass) => {
        if (!newClass || !newClass._id) {
            console.warn('Invalid class data provided to addClassToStore');
            return;
        }
        
        const currentClasses = get().classes;
        
        // Check for duplicates
        const exists = currentClasses.some(cls => cls._id === newClass._id);
        if (exists) {
            console.warn('Class already exists in store');
            return;
        }
        
        set({ classes: [...currentClasses, newClass] });
        toast.success('Class added successfully');
    },

    // Update a class in the store
    updateClassInStore: (updatedClass) => {
        if (!updatedClass || !updatedClass._id) {
            console.warn('Invalid class data provided to updateClassInStore');
            return;
        }
        
        const currentClasses = get().classes;
        const updatedClasses = currentClasses.map(cls => 
            cls._id === updatedClass._id ? updatedClass : cls
        );
        
        set({ classes: updatedClasses });
        
        // Update selected class if it's the one being updated
        const { selectedClass } = get();
        if (selectedClass && selectedClass._id === updatedClass._id) {
            set({ selectedClass: updatedClass });
            get().generateAvailableSessions(updatedClass);
        }
        
        toast.success('Class updated successfully');
    },

    // Remove a class from the store
    removeClassFromStore: (classId) => {
        const currentClasses = get().classes;
        const filteredClasses = currentClasses.filter(cls => cls._id !== classId);
        
        set({ classes: filteredClasses });
        
        // Clear selected class if it's the one being removed
        const { selectedClass } = get();
        if (selectedClass && selectedClass._id === classId) {
            set({ selectedClass: null, availableSessions: [] });
        }
        
        toast.success('Class removed successfully');
    },

    // Generate available sessions for the next 4 weeks
    generateAvailableSessions: (classData, weeksToGenerate = 4) => {
        if (!classData || !classData.timeSlot) {
            console.warn('Invalid class data provided to generateAvailableSessions');
            set({ availableSessions: [] });
            return [];
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day
        
        // Map day names to numbers
        const dayMap = {
            'Sunday': 0, 
            'Monday': 1, 
            'Tuesday': 2, 
            'Wednesday': 3,
            'Thursday': 4, 
            'Friday': 5, 
            'Saturday': 6
        };
        
        const targetDay = dayMap[classData.timeSlot.day];
        if (targetDay === undefined) {
            console.warn(`Invalid day in timeSlot: ${classData.timeSlot.day}`);
            set({ availableSessions: [] });
            return [];
        }
        
        // Calculate days until the next occurrence of target day
        const currentDay = today.getDay();
        let daysUntilTarget = (targetDay - currentDay + 7) % 7;
        if (daysUntilTarget === 0) daysUntilTarget = 7; // If today, start from next week
        
        const firstSessionDate = new Date(today);
        firstSessionDate.setDate(today.getDate() + daysUntilTarget);
        
        // Generate sessions for the specified number of weeks
        const sessions = [];
        for (let week = 0; week < weeksToGenerate; week++) {
            const sessionDate = new Date(firstSessionDate);
            sessionDate.setDate(firstSessionDate.getDate() + (week * 7));
            
            const dateString = sessionDate.toISOString().split('T')[0];
            
            // Calculate spots left (this is a simplified calculation)
            // In a real app, you'd want to fetch actual bookings for each date
            const spotsLeft = classData.capacity - (classData.attendees?.length || 0);
            
            sessions.push({
                date: dateString,
                day: classData.timeSlot.day,
                startTime: classData.timeSlot.startTime,
                endTime: classData.timeSlot.endTime,
                duration: classData.duration,
                spotsLeft: Math.max(0, spotsLeft), // Ensure non-negative
                capacity: classData.capacity,
                sessionKey: `${dateString}_${classData.timeSlot.startTime}`
            });
        }
        
        set({ availableSessions: sessions });
        return sessions;
    },

    // Refresh a specific class data
    refreshClass: async (classId) => {
        try {
            const response = await axios.get(`/trainer/viewClass/${classId}`);
            const classData = response.data;
            
            // Update in classes array
            get().updateClassInStore(classData);
            
            // Update selected class if it matches
            const { selectedClass } = get();
            if (selectedClass && selectedClass._id === classId) {
                set({ selectedClass: classData });
                get().generateAvailableSessions(classData);
            }
            
            return classData;
        } catch (error) {
            console.error("Error refreshing class:", error);
            toast.error('Failed to refresh class data');
            return null;
        }
    },

    // Clear error
    clearError: () => {
        set({ error: null });
    },

    // Clear selected class
    clearSelectedClass: () => {
        set({ selectedClass: null, availableSessions: [], error: null });
    },

    // Reset store to initial state
    resetStore: () => {
        set({
            classes: [],
            selectedClass: null,
            availableSessions: [],
            isLoading: false,
            isBooking: false,
            error: null
        });
    }
}));