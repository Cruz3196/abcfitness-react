import { create } from 'zustand';

// --- MOCK USER DATA ---
// This simulates a user being logged in. For testing, you can change the
// _id to match a review author (e.g., 'user1' from the reviewStore) 
// to see the edit/delete icons appear.
const mockUser = {
  _id: 'user1', // Change this to 'user2' or something else to test non-author view
    username: 'Bob Williams',
    email: 'bob@example.com',
    role: 'customer',
    profileImage: 'https://placehold.co/100x100/60a5fa/ffffff?text=B',
    };
    // To simulate a logged-out user, you can set mockUser to null:
    // const mockUser = null; 
    // ---

    export const userStore = create((set) => ({
        user: mockUser, // The user is logged in by default with our mock data
        isCheckingAuth: false, // We're not checking auth in this mock setup

        // The functions below are placeholders for when you connect to your backend API.
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
}));

