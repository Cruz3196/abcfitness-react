import { create } from 'zustand';
import axios from '../api/axios';
import toast from 'react-hot-toast';

export const classStore = create((set, get) => ({
    classes: [],
    selectedClass: null,
    availableSessions: [],
    isLoading: true,
    error: null,
    isBooking: false,

    // Fetches all available classes from the backend
    fetchAllClasses: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get('/user/ourClasses');
            set({ 
                classes: response.data.classes, 
                isLoading: false 
            });
        } catch (error) {
            console.error("Error fetching classes:", error);
            set({ 
                isLoading: false, 
                error: error.response?.data?.message || "Failed to fetch classes",
                classes: []
            });
            
            if (error.response?.status !== 404) {
                toast.error(error.response?.data?.message || "Failed to fetch classes");
            }
        }
    },

    // Gets a single class by its ID from the existing state or fetches all if needed
    fetchClassById: async (classId) => {
        set({ isLoading: true, selectedClass: null, error: null });
        try {
            // First check if we already have it in our classes array
            const existingClass = get().classes.find(c => c._id === classId);
            
            if (existingClass) {
                set({ selectedClass: existingClass, isLoading: false });
                get().generateAvailableSessions(existingClass);
                return;
            }

            // If not found in array, fetch from dedicated endpoint
            const response = await axios.get(`/viewClass/${classId}`);
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

    // Generates available sessions for a class based on its schedule
    generateAvailableSessions: (classInfo) => {
        const sessions = [];
        const today = new Date();
            
            // Generate sessions for the next 4 weeks
        for (let i = 0; i < 4; i++) {
                const sessionDate = new Date(today);
                const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const targetDay = dayNames.indexOf(classInfo.timeSlot?.day);
                
                if (targetDay !== -1) {
                    // Calculate days until the target day
                    let daysUntilTarget = (targetDay - today.getDay() + 7) % 7;
                    
                    // If today is the target day, check if the class time has passed
                    if (daysUntilTarget === 0) {
                        const [hours, minutes] = (classInfo.timeSlot?.startTime || '09:00').split(':');
                        const classTime = new Date(today);
                        classTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                        
                        // If the class time has passed today, schedule for next week
                        if (today > classTime) {
                            daysUntilTarget = 7;
                        }
                    }
                    
                    sessionDate.setDate(today.getDate() + daysUntilTarget + (i * 7));
                    
                    // Calculate end time based on start time and duration
                    const startTime = classInfo.timeSlot?.startTime || '09:00';
                    let endTime = classInfo.timeSlot?.endTime;
                    
                    // If endTime is not provided, calculate it from startTime + duration
                    if (!endTime && classInfo.duration) {
                        const [startHours, startMinutes] = startTime.split(':');
                        const startDate = new Date();
                        startDate.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);
                        
                        const endDate = new Date(startDate.getTime() + classInfo.duration * 60000); // Add duration in milliseconds
                        endTime = endDate.toTimeString().slice(0, 5); // Format as HH:MM
                    }
                    
                    sessions.push({
                        date: sessionDate.toISOString().split('T')[0], // "YYYY-MM-DD"
                        spotsLeft: classInfo.capacity - (classInfo.attendees?.length || 0),
                        dayName: classInfo.timeSlot?.day,
                        startTime: startTime,
                        endTime: endTime || startTime, // Fallback to startTime if endTime is not available
                        duration: classInfo.duration
                    });
                }
            }
            set({ availableSessions: sessions });
    },

    // Book a class session
    bookClass: async (classId, date) => {
        set({ isBooking: true });
        try {
            const response = await axios.post(`/user/bookings/${classId}`, { date });
            toast.success(response.data.message || 'Successfully booked your class!');
            
            // Refresh the class data to update attendee count
            await get().fetchClassById(classId);
            
            set({ isBooking: false });
            return true;
        } catch (error) {
            console.error("Error booking class:", error);
            toast.error(error.response?.data?.message || 'Failed to book class');
            set({ isBooking: false });
            return false;
        }
    },

    // Clear selected class
    clearSelectedClass: () => {
        set({ selectedClass: null, availableSessions: [] });
    },

    // Clear error
    clearError: () => {
        set({ error: null });
    }
}));