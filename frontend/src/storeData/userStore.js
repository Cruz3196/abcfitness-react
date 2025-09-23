import { create } from 'zustand';

// --- MOCK USER DATA ---
// Change role to test different user types: 'customer', 'trainer', 'admin'
const mockUser = {
    _id: 'user1',
    username: 'Bob Williams',
    email: 'bob@example.com',
    role: 'admin', // Change this to 'trainer' or 'customer' to test different views
    profileImage: 'https://placehold.co/100x100/60a5fa/ffffff?text=B',
};

export const userStore = create((set, get) => ({
    user: mockUser,
    isCheckingAuth: false,
    isUpdatingProfile: false,
    isDeletingAccount: false,

    checkAuthStatus: async () => {
        set({ user: mockUser, isCheckingAuth: false });
    },
    
    login: async (email, password) => {
        set({ user: mockUser });
        return true;
    },
    
    logout: async () => {
        set({ user: null });
    },

    updateProfile: async (profileData) => {
        set({ isUpdatingProfile: true });
        try {
            const currentUser = get().user;
            const updatedUser = { ...currentUser, ...profileData };
            set({ user: updatedUser, isUpdatingProfile: false });
            return { success: true, message: 'Profile updated successfully' };
        } catch (error) {
            set({ isUpdatingProfile: false });
            return { success: false, message: 'Failed to update profile' };
        }
    },

    deleteAccount: async () => {
        set({ isDeletingAccount: true });
        try {
            set({ user: null, isDeletingAccount: false });
            return { success: true, message: 'Account deleted successfully' };
        } catch (error) {
            set({ isDeletingAccount: false });
            return { success: false, message: 'Failed to delete account' };
        }
    },

    // Helper functions to check user roles
    isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin';
    },
    
    isTrainer: () => {
        const { user } = get();
        return user?.role === 'trainer';
    },
    
    isCustomer: () => {
        const { user } = get();
        return user?.role === 'customer';
    }
}));