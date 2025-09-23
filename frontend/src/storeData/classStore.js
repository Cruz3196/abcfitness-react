import { create } from 'zustand';

// --- MOCK DATA ---
const mockClasses = [
    { _id: 'class1', classTitle: 'Vinyasa Flow Yoga', classDescription: 'A dynamic practice that links breath with movement. Suitable for all levels, this class will build strength, flexibility, and inner peace.', classPic: 'https://placehold.co/600x400/6D28D9/FFFFFF?text=Yoga', trainer: { _id: 't1', user: { username: 'Jane Doe' } }, timeSlot: { day: 'Tuesday', startTime: '18:00' }, capacity: 15, price: 20 },
    { _id: 'class2', classTitle: 'Advanced CrossFit', classDescription: 'Push your limits with high-intensity functional movements. This class is designed for experienced athletes looking to improve their performance.', classPic: 'https://placehold.co/600x400/BE123C/FFFFFF?text=CrossFit', trainer: { _id: 't2', user: { username: 'John Smith' } }, timeSlot: { day: 'Wednesday', startTime: '17:30' }, capacity: 12, price: 30 },
    { _id: 'class3', classTitle: 'HIIT Cardio Blast', classDescription: 'A 45-minute high-intensity interval training session to maximize calorie burn and boost your metabolism. Get ready to sweat!', classPic: 'https://placehold.co/600x400/047857/FFFFFF?text=HIIT', trainer: { _id: 't3', user: { username: 'Emily White' } }, timeSlot: { day: 'Friday', startTime: '07:00' }, capacity: 20, price: 25 },
];
// ---

export const classStore = create((set, get) => ({
    classes: [],
    availableSessions: [],
    isLoading: true,

    // Fetches all classes (currently mock)
    fetchAllClasses: () => {
        set({ isLoading: true });
        setTimeout(() => {
        set({ classes: mockClasses, isLoading: false });
        }, 500);
    },

    // Gets a single class by its ID from the existing state
    getClassById: (id) => {
        const classInfo = get().classes.find(c => c._id === id);
        return classInfo;
    },

    // ✅ NEW: Generates a list of bookable sessions for a class
    fetchAvailableSessions: (classId) => {
        // In a real app, this would be an API call. Here, we simulate it.
        const classInfo = get().getClassById(classId);
        if (!classInfo) return;

        const sessions = [];
        for (let i = 0; i < 4; i++) { // Generate for the next 4 available days
            const date = new Date();
            date.setDate(date.getDate() + (i * 7)); // Simple weekly logic for now
            sessions.push({
                date: date.toISOString().split('T')[0], // "YYYY-MM-DD"
                spotsLeft: classInfo.capacity - Math.floor(Math.random() * 5), // Random spots
            });
        }
        set({ availableSessions: sessions });
    }
}));

