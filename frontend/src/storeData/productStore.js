import { create } from 'zustand';
import axios from "../api/axios";
import toast from "react-hot-toast";

export const productStore = create((set, get) => ({
    products: [],
    categories: [],
    recommendedProducts: [], // New state for recommendations
    isLoading: true,
    error: null,
    
    // Fetch all products from the API
    fetchAllProducts: async () => {
        set({ isLoading: true });
        try {
            const { data } = await axios.get('/products/all');
            const products = data.products || data;
            const uniqueCategories = [...new Set(products.map(p => p.productCategory).filter(Boolean))];
            
            set({ 
                products, 
                categories: uniqueCategories, 
                isLoading: false 
            });
            return products;
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
            set({ isLoading: false, error: error.message });
            return [];
        }
    },

    // Get product by ID
    getProductById: (id) => {
        return get().products.find(p => p._id === id);
    },

    // Fetch recommended products
    fetchRecommendedProducts: async (currentProductId) => {
        try {
            const { data } = await axios.get('/products/recommended');
            const filtered = data.filter(p => p._id !== currentProductId);
            set({ recommendedProducts: filtered });
            return filtered;
        } catch (error) {
            console.error('Error fetching recommended products:', error);
            return [];
        }
    },
    
    // Add product (admin only)
    createProduct: async (productData) => {
        set({ isLoading: true });
        try {
            const { data } = await axios.post('/products/create', productData);
            // Update local state by appending the new product
            set(state => ({ 
                products: [...state.products, data],
                isLoading: false 
            }));
            toast.success('Product created successfully');
            return data;
        } catch (error) {
            console.error('Error creating product:', error);
            toast.error(error.response?.data?.error || 'Failed to create product');
            set({ isLoading: false, error: error.message });
            return null;
        }
    }
}));

