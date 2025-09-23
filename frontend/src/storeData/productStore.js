import { create } from 'zustand';

// --- MOCK DATA ---
const mockProducts = [
    { _id: '1', productName: 'Premium Yoga Mat', productPrice: 49.99, productCategory: 'Yoga', productImage: 'https://placehold.co/400x225/A3E635/000000?text=Yoga+Mat', productDescription: 'A durable and eco-friendly mat for all your yoga needs.' },
    { _id: '2', productName: 'Adjustable Dumbbells', productPrice: 129.99, productCategory: 'Strength', productImage: 'https://placehold.co/400x225/F97316/FFFFFF?text=Dumbbells', productDescription: 'Versatile dumbbells that adjust to your desired weight.' },
    { _id: '3', productName: 'Running Shoes', productPrice: 89.99, productCategory: 'Cardio', productImage: 'https://placehold.co/400x225/3B82F6/FFFFFF?text=Shoes', productDescription: 'Lightweight and comfortable shoes for your daily run.' },
    { _id: '4', productName: 'Protein Powder', productPrice: 39.99, productCategory: 'Supplements', productImage: 'https://placehold.co/400x225/FACC15/000000?text=Protein', productDescription: 'High-quality whey protein for muscle recovery and growth.' },
    { _id: '5', productName: 'Resistance Bands Set', productPrice: 24.99, productCategory: 'Strength', productImage: 'https://placehold.co/400x225/EC4899/FFFFFF?text=Bands', productDescription: 'A set of 5 bands with varying resistance levels.' },
    { _id: '6', productName: 'Fitness Tracker', productPrice: 99.99, productCategory: 'Accessories', productImage: 'https://placehold.co/400x225/6366F1/FFFFFF?text=Tracker', productDescription: 'Track your steps, heart rate, and workouts with ease.' },
];
// ---

export const productStore = create((set, get) => ({
    products: [],
    categories: [],
    recommendedProducts: [], // New state for recommendations
    isLoading: true,

    // Fetches all products (currently mock)
    fetchAllProducts: () => {
        set({ isLoading: true });
        setTimeout(() => {
        const uniqueCategories = [...new Set(mockProducts.map(p => p.productCategory).filter(Boolean))];
        set({ products: mockProducts, categories: uniqueCategories, isLoading: false });
        }, 500);
    },

  // Gets a single product by its ID from the existing state
    getProductById: (id) => {
        const product = get().products.find(p => p._id === id);
        return product;
    },

  // ✅ NEW: Fetches recommended products
    fetchRecommendedProducts: (currentProductId) => {
        // In a real app, this would be: const { data } = await api.get('/products/recommended');
        setTimeout(() => {
            // Simulate recommendation: filter out the current product and take the first 3
            const recommendations = mockProducts
                .filter(p => p._id !== currentProductId)
                .slice(0, 3);
            set({ recommendedProducts: recommendations });
        }, 300); // Shorter delay for secondary content
    }
}));

