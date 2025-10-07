import { create } from 'zustand';
import axios from '../api/axios';
import toast from 'react-hot-toast';

export const trainerStore = create((set, get) => ({
    trainers: [],
    selectedTrainer: null,
    trainerClasses: [],
    isLoading: true,
    error: null,

    // Fetches all public-facing trainer profiles from the backend
    fetchAllTrainers: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get('/user/ourTrainers');
            set({ 
                trainers: response.data, 
                isLoading: false 
            });
        } catch (error) {
            console.error("Error fetching trainers:", error);
            set({ 
                isLoading: false, 
                error: error.response?.data?.message || "Failed to fetch trainers",
                trainers: []
            });
            
            // Only show toast for non-404 errors
            if (error.response?.status !== 404) {
                toast.error(error.response?.data?.message || "Failed to fetch trainers");
            }
        }
    },

    // Gets a single trainer by their ID
    fetchTrainerById: async (trainerId) => {
        set({ isLoading: true, selectedTrainer: null, error: null });
        try {
            // First check if we already have the trainer in our array
            const existingTrainer = get().trainers.find(t => t._id === trainerId);
            
            if (existingTrainer) {
                set({ selectedTrainer: existingTrainer, isLoading: false });
                return;
            }

            // If not found, fetch from API
            const response = await axios.get(`/user/viewTrainer/${trainerId}`);
            set({ 
                selectedTrainer: response.data, 
                trainerClasses: response.data.classes || [], 
                isLoading: false 
            });
        } catch (error) {
            console.error("Error fetching trainer by ID:", error);
            set({ 
                isLoading: false, 
                error: error.response?.data?.message || "Failed to fetch trainer details" 
            });
        }
    },
    
    getTrainerById: async (trainerId) => {
        return get().fetchTrainerById(trainerId);
    },

    // Gets all classes taught by a specific trainer
    fetchClassesByTrainer: async (trainerId) => {
        try {
            // If we already have classes from fetchTrainerById, return them
            const currentClasses = get().trainerClasses;
            if (currentClasses && currentClasses.length > 0) {
                return currentClasses;
            }

            // Otherwise, fetch from all classes endpoint
            const response = await axios.get('/user/ourClasses');
            const allClasses = response.data.classes || [];
            
            const trainerClasses = allClasses.filter(classItem => 
                classItem.trainer?._id === trainerId
            );
            
            set({ trainerClasses });
            return trainerClasses;
        } catch (error) {
            console.error("Error fetching trainer classes:", error);
            set({ trainerClasses: [] });
            return [];
        }
    },

    // Clears the selected trainer data from the store
    clearSelectedTrainer: () => {
        set({ selectedTrainer: null, trainerClasses: [], error: null });
    },
}));