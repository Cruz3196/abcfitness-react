import { create } from 'zustand';

// --- MOCK DATA ---
const mockTrainers = [
    { _id: 't1', user: { username: 'Alice Johnson' }, trainerProfilePic: 'https://placehold.co/150x150/f87171/ffffff?text=Alice', specialization: 'Yoga & Flexibility', bio: 'Passionate about helping you find balance and peace through yoga.' },
    { _id: 't2', user: { username: 'Bob Williams' }, trainerProfilePic: 'https://placehold.co/150x150/60a5fa/ffffff?text=Bob', specialization: 'Strength Training', bio: 'Certified strength and conditioning specialist focused on building power.' },
    { _id: 't3', user: { username: 'Charlie Brown' }, trainerProfilePic: 'https://placehold.co/150x150/fbbf24/ffffff?text=Charlie', specialization: 'HIIT & Cardio', bio: 'High-energy coach to push your cardiovascular limits.' },
    { _id: 't4', user: { username: 'Diana Prince' }, trainerProfilePic: 'https://placehold.co/150x150/c084fc/ffffff?text=Diana', specialization: 'CrossFit', bio: 'Functional fitness expert ready to help you achieve peak performance.' },
];
// This would eventually come from your classStore or a shared data source
const mockClasses = [
    { _id: 'class1', classTitle: 'Vinyasa Flow Yoga', classPic: 'https://placehold.co/400x225/6D28D9/FFFFFF?text=Yoga', trainer: { _id: 't1', user: { username: 'Alice Johnson' } } },
    { _id: 'class2', classTitle: 'Advanced CrossFit', classPic: 'https://placehold.co/400x225/BE123C/FFFFFF?text=CrossFit', trainer: { _id: 't4', user: { username: 'Diana Prince' } } },
    { _id: 'class3', classTitle: 'HIIT Cardio Blast', classPic: 'https://placehold.co/400x225/047857/FFFFFF?text=HIIT', trainer: { _id: 't3', user: { username: 'Charlie Brown' } } },
    { _id: 'class4', classTitle: 'Sunrise Yoga', classPic: 'https://placehold.co/400x225/6D28D9/FFFFFF?text=Yoga', trainer: { _id: 't1', user: { username: 'Alice Johnson' } } },
];
// ---

export const trainerStore = create((set, get) => ({
    trainers: [],
    isLoading: true,

    // Fetches all public-facing trainer profiles (currently from mock data)
    fetchAllTrainers: () => {
        set({ isLoading: true });
        setTimeout(() => {
            set({ trainers: mockTrainers, isLoading: false });
        }, 500);
    },

    // ✅ NEW: Gets a single trainer by their ID from the existing state
    getTrainerById: (id) => {
        return get().trainers.find(t => t._id === id);
    },

    // ✅ NEW: Gets all classes taught by a specific trainer
    fetchClassesByTrainer: (trainerId) => {
        // This simulates finding classes for a specific trainer
        return mockClasses.filter(c => c.trainer._id === trainerId);
    }
}));

