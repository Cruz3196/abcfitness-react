import { create } from 'zustand';
import axios from '../api/axios';
import { toast } from 'react-hot-toast';

const useCartStore = create((set, get) => ({
    // State
    cart: [],
    total: 0,
    subtotal: 0, 
    totalQuantity: 0,
    isLoading: false,

    // getting all the products in the cart 
    getCartProducts: async () => {
        try {

            set({ isLoading: true });
            
            const res = await axios.get("/cart/cartProducts");
            set({ cart: res.data, isLoading: false });
            get().calculateTotals();
        } catch (error) {
            set({ isLoading: false, cart: [] });
            
            if (error.response?.status !== 401) {
                console.error('Unexpected cart error:', error.message);
            }
        }
    },

    // adding a product to the cart 
    addToCart: async (product) => {
        try{
            await axios.post("/cart/addToCart", { productId: product._id });
            toast.success("Product added to cart");

            set((prevState) => {
                const existingItem = prevState.cart.find((item) => item._id === product._id);
                const newCart = existingItem
                    ? prevState.cart.map((item) =>
                            item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                    )
                    : [...prevState.cart, { ...product, quantity: 1 }];
                return { cart: newCart };
            })
            get().calculateTotals();
        }catch(error){
            toast.error(error.response?.data?.message || "Failed to add to cart");
        }
    },

    // deleting a product from the cart 
    removeFromCart: async (productId) => {
        try {
            console.log('Removing product:', productId);
            await axios.delete(`/cart/removeFromCart/${productId}`);
            set((prevState) => ({
                cart: prevState.cart.filter((item) => item._id !== productId)
            }));
            get().calculateTotals();
            toast.success("Product removed from cart");
        } catch (error) {
            console.error("Remove from cart error:", error);
            toast.error(error.response?.data?.message || "Failed to remove from cart");
        }
    },

    // updateQuantity function
    updateQuantity: async (productId, quantity) => {
        try {
            console.log('Updating quantity for product:', productId, 'to:', quantity);
            
            await axios.put(`/cart/updateQuantity/${productId}`, { quantity });
            
            set((prevState) => {
                if (quantity === 0) {
                    return {
                        cart: prevState.cart.filter((item) => item._id !== productId)
                    };
                } else {
                    return {
                        cart: prevState.cart.map((item) =>
                            item._id === productId ? { ...item, quantity } : item
                        )
                    };
                }
            });
            
            get().calculateTotals();
            toast.success("Cart updated");
            
        } catch (error) {
            console.error("Update quantity error:", error);
            toast.error(error.response?.data?.message || "Failed to update quantity");
            get().getCartProducts();
        }
    },

    // clearing the cart when user checks out
    clearCart: async () => {
        try {
            // Clear cart on server
            await axios.delete("/cart/clearCart");
            set({ cart: [], total: 0, subtotal: 0, totalQuantity: 0 });
            toast.success("Cart cleared");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to clear cart");
        }
    },
    
    // Clear local cart state (for user switching)
    clearCartState: () => {
        set({ 
            cart: [], 
            total: 0, 
            subtotal: 0, 
            totalQuantity: 0,
            isLoading: false 
        });
    },

    calculateTotals: () => {
        const { cart } = get();
        const subtotal = cart.reduce((sum, item) => {
            const price = item.productPrice || item.price || 0;
            return sum + price * item.quantity;
        }, 0);
        
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
        let total = subtotal;

        set({ subtotal, total, totalQuantity });
    },
}));

export default useCartStore;