import { create } from 'zustand';

// Mock cart data
const mockCartItems = [
    {
        id: 1,
        name: "Whey Protein Powder",
        price: 49.99,
        quantity: 2,
        image: "/images/whey-protein.jpg",
        category: "Supplements"
    },
    {
        id: 2,
        name: "Resistance Bands Set",
        price: 29.99,
        quantity: 1,
        image: "/images/resistance-bands.jpg",
        category: "Equipment"
    },
    {
        id: 3,
        name: "Pre-Workout Energy Drink",
        price: 34.99,
        quantity: 3,
        image: "/images/pre-workout.jpg",
        category: "Supplements"
    },
    {
        id: 4,
        name: "Yoga Mat",
        price: 39.99,
        quantity: 1,
        image: "/images/yoga-mat.jpg",
        category: "Equipment"
    }
];

const useCartStore = create((set, get) => ({
    // State
    cartItems: mockCartItems,
    isLoading: false,
    error: null,

    // Actions
    addToCart: (product) => set((state) => {
        const existingItem = state.cartItems.find(item => item.id === product.id);
        if (existingItem) {
            return {
                cartItems: state.cartItems.map(item =>
                    item.id === product.id 
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            };
        }
        return {
            cartItems: [...state.cartItems, { ...product, quantity: 1 }]
        };
    }),

    updateQuantity: (productId, quantity) => set((state) => ({
        cartItems: state.cartItems.map(item =>
            item.id === productId 
                ? { ...item, quantity: Math.max(1, quantity) }
                : item
        )
    })),

    removeFromCart: (productId) => set((state) => ({
        cartItems: state.cartItems.filter(item => item.id !== productId)
    })),

    clearCart: () => set({ cartItems: [] }),

    // Computed values
    getTotalItems: () => {
        const { cartItems } = get();
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    },

    getTotalPrice: () => {
        const { cartItems } = get();
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
}));

export default useCartStore;
