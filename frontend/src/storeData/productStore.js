import { create } from 'zustand';
import axios from "../api/axios";
import toast from "react-hot-toast";

export const productStore = create((set, get) => ({
    products: [],
    categories: [],
    recommendedProducts: [],
    isLoading: true,
    error: null,
    
    // Fetch all products from the API
    fetchAllProducts: async () => {
        set({ isLoading: true });
        try {
            const { data } = await axios.get('/products/all'); // ✅ Correct
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
            const { data } = await axios.get('/products/recommended'); // ✅ Correct
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
            const { data } = await axios.post('/products/create', productData); // ✅ Correct
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
    },

    // Update product (admin only) - FIX THIS
    updateProduct: async (productId, productData) => {
        set({ isLoading: true });
        try {
            const { data } = await axios.put(`/products/${productId}`, productData); // ✅ FIXED: Changed from /product/ to /products/
            set(state => ({ 
                products: state.products.map(p => 
                    p._id === productId ? data : p
                ),
                isLoading: false 
            }));
            toast.success('Product updated successfully');
            return data;
        } catch (error) {
            console.error('Error updating product:', error);
            console.error('Full error response:', error.response);
            toast.error(error.response?.data?.error || error.response?.data?.message || 'Failed to update product');
            set({ isLoading: false, error: error.message });
            return null;
        }
    },

    // Delete product (admin only) - FIX THIS
    deleteProduct: async (productId) => {
        try {
            await axios.delete(`/products/${productId}`); // ✅ FIXED: Changed from /product/ to /products/
            set(state => ({ 
                products: state.products.filter(p => p._id !== productId)
            }));
            toast.success('Product deleted successfully');
            return true;
        } catch (error) {
            console.error('Error deleting product:', error);
            console.error('Full error response:', error.response);
            toast.error(error.response?.data?.error || error.response?.data?.message || 'Failed to delete product');
            return false;
        }
    },

    // Toggle featured status (admin only) - FIX THIS
    toggleFeaturedProduct: async (productId) => {
        try {
            console.log('Toggling featured for product:', productId);
            const { data } = await axios.put(`/products/${productId}/toggle-featured`); // ✅ FIXED: Changed from /product/ to /products/
            set(state => ({ 
                products: state.products.map(p => 
                    p._id === productId ? { ...p, isFeatured: data.isFeatured } : p
                )
            }));
            toast.success(`Product ${data.isFeatured ? 'featured' : 'unfeatured'} successfully`);
            return data;
        } catch (error) {
            console.error('Error toggling featured status:', error);
            console.error('Full error response:', error.response);
            toast.error(error.response?.data?.error || error.response?.data?.message || 'Failed to toggle featured status');
            return null;
        }
    }
}));