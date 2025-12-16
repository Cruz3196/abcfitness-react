import { create } from "zustand";
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
      const { data } = await axios.get("/products/all");
      const products = data.products || data;
      const uniqueCategories = [
        ...new Set(products.map((p) => p.productCategory).filter(Boolean)),
      ];

      set({
        products,
        categories: uniqueCategories,
        isLoading: false,
      });
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      // Don't show toast for 401 errors - these are handled by the axios interceptor
      if (error.response?.status !== 401) {
        toast.error("Failed to load products");
      }
      set({ isLoading: false, error: error.message });
      return [];
    }
  },

  // Get product by ID
  getProductById: (id) => {
    return get().products.find((p) => p._id === id);
  },

  // Fetch recommended products
  fetchRecommendedProducts: async (currentProductId) => {
    try {
      const { data } = await axios.get("/products/recommended");
      const filtered = data.filter((p) => p._id !== currentProductId);
      set({ recommendedProducts: filtered });
      return filtered;
    } catch (error) {
      console.error("Error fetching recommended products:", error);
      return [];
    }
  },

  // Add product (admin only)
  createProduct: async (productData) => {
    set({ isLoading: true });
    try {
      const { data } = await axios.post("/products/create", productData);
      set((state) => ({
        products: [...state.products, data],
        isLoading: false,
      }));
      toast.success("Product created successfully");
      return data;
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error(error.response?.data?.error || "Failed to create product");
      set({ isLoading: false, error: error.message });
      return null;
    }
  },

  // Update product (admin only) - FIX THIS
  updateProduct: async (productId, productData) => {
    set({ isLoading: true });
    try {
      const { data } = await axios.put(`/products/${productId}`, productData);
      set((state) => ({
        products: state.products.map((p) => (p._id === productId ? data : p)),
        isLoading: false,
      }));
      toast.success("Product updated successfully");
      return data;
    } catch (error) {
      console.error("Error updating product:", error);
      console.error("Full error response:", error.response);
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to update product"
      );
      set({ isLoading: false, error: error.message });
      return null;
    }
  },

  // Delete product (admin only) - FIX THIS
  deleteProduct: async (productId) => {
    try {
      await axios.delete(`/products/${productId}`);
      set((state) => ({
        products: state.products.filter((p) => p._id !== productId),
      }));
      toast.success("Product deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      console.error("Full error response:", error.response);
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to delete product"
      );
      return false;
    }
  },

  // Toggle featured status (admin only) - FIX THIS
  toggleFeaturedProduct: async (productId) => {
    try {
      console.log("Toggling featured for product:", productId);
      const { data } = await axios.put(
        `/products/${productId}/toggle-featured`
      );
      set((state) => ({
        products: state.products.map((p) =>
          p._id === productId ? { ...p, isFeatured: data.isFeatured } : p
        ),
      }));
      toast.success(
        `Product ${data.isFeatured ? "featured" : "unfeatured"} successfully`
      );
      return data;
    } catch (error) {
      console.error("Error toggling featured status:", error);
      console.error("Full error response:", error.response);
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to toggle featured status"
      );
      return null;
    }
  },

  // Product Review State
  productReviews: [],
  reviewsLoading: false,
  reviewSubmitting: false,

  // Fetch reviews for a product
  fetchProductReviews: async (productId) => {
    set({ reviewsLoading: true });
    try {
      const { data } = await axios.get(`/products/${productId}/reviews`);
      set({
        productReviews: data.reviews || [],
        reviewsLoading: false,
      });
      return data;
    } catch (error) {
      console.error("Error fetching product reviews:", error);
      set({ reviewsLoading: false, productReviews: [] });
      return { reviews: [], averageRating: 0, totalReviews: 0 };
    }
  },

  // Submit a new review
  submitProductReview: async (productId, reviewData) => {
    set({ reviewSubmitting: true });
    try {
      const { data } = await axios.post(`/products/${productId}/reviews`, reviewData);
      
      // Add the new review to the beginning of the reviews array
      set((state) => ({
        productReviews: [data.review, ...state.productReviews],
        reviewSubmitting: false,
      }));

      // Update the product's average rating in the products array
      set((state) => ({
        products: state.products.map((p) =>
          p._id === productId ? { ...p, productRating: data.averageRating } : p
        ),
      }));

      toast.success("Thank you for your review!");
      return { success: true, review: data.review };
    } catch (error) {
      console.error("Error submitting review:", error);
      const errorMessage = error.response?.data?.message || "Failed to submit review";
      toast.error(errorMessage);
      set({ reviewSubmitting: false });
      return { success: false, error: errorMessage };
    }
  },

  // Update a review
  updateProductReview: async (productId, reviewId, updateData) => {
    set({ reviewSubmitting: true });
    try {
      const { data } = await axios.put(`/products/${productId}/reviews/${reviewId}`, updateData);
      
      // Update the review in the store
      set((state) => ({
        productReviews: state.productReviews.map((review) =>
          review._id === reviewId ? data.review : review
        ),
        reviewSubmitting: false,
      }));

      // Update the product's average rating
      set((state) => ({
        products: state.products.map((p) =>
          p._id === productId ? { ...p, productRating: data.averageRating } : p
        ),
      }));

      toast.success("Review updated successfully");
      return { success: true };
    } catch (error) {
      console.error("Error updating review:", error);
      const errorMessage = error.response?.data?.message || "Failed to update review";
      toast.error(errorMessage);
      set({ reviewSubmitting: false });
      return { success: false, error: errorMessage };
    }
  },

  // Delete a review
  deleteProductReview: async (productId, reviewId) => {
    set({ reviewSubmitting: true });
    try {
      const { data } = await axios.delete(`/products/${productId}/reviews/${reviewId}`);
      
      // Remove the review from the store
      set((state) => ({
        productReviews: state.productReviews.filter((review) => review._id !== reviewId),
        reviewSubmitting: false,
      }));

      // Update the product's average rating
      set((state) => ({
        products: state.products.map((p) =>
          p._id === productId ? { ...p, productRating: data.averageRating } : p
        ),
      }));

      toast.success("Review deleted successfully");
      return { success: true };
    } catch (error) {
      console.error("Error deleting review:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete review";
      toast.error(errorMessage);
      set({ reviewSubmitting: false });
      return { success: false, error: errorMessage };
    }
  },

  // Check if user has already reviewed a product
  hasUserReviewed: (userId) => {
    return get().productReviews.some((review) => review.user?._id === userId);
  },

  // Clear reviews (useful when navigating away)
  clearProductReviews: () => {
    set({ productReviews: [] });
  },
}));
