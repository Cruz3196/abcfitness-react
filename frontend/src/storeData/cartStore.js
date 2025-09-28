import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const useCartStore = create((set, get) => ({
    // State
    cart: [],
    total: 0,
    subtotal: 0, 
    totalQuantity: 0,
    isLoading: false,

    // Add method to clear local cart state (for user switching)
    clearCartState: () => {
        set({ 
            cart: [], 
            total: 0, 
            subtotal: 0, 
            totalQuantity: 0 
        });
    },

    // getting all the products in the cart 
    getCartProducts: async () =>{
        try{
            const res = await axios.get("/api/cart/cartProducts");
            set({ cart: res.data });
            get().calculateTotals();
        }catch(error){
            set({ cart: [] });
            toast.error(error.response?.data?.message || "Failed to fetch cart products");
        }
    },

    // ... rest of your existing code stays the same ...

    // adding a product to the cart 
    addToCart: async (product) => {
        try{
            await axios.post("/api/cart/addToCart", { productId: product._id });
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
            await axios.delete(`/api/cart/removeFromCart/${productId}`);
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

    // updateQuantity function - FIXED VERSION
    updateQuantity: async (productId, quantity) => {
        try {
            console.log('Updating quantity for product:', productId, 'to:', quantity);
            
            // Update backend
            await axios.put(`/api/cart/updateQuantity/${productId}`, { quantity });
            
            // Update local state immediately
            set((prevState) => {
                if (quantity === 0) {
                    // Remove item if quantity is 0
                    return {
                        cart: prevState.cart.filter((item) => item._id !== productId)
                    };
                } else {
                    // Update quantity
                    return {
                        cart: prevState.cart.map((item) =>
                            item._id === productId ? { ...item, quantity } : item
                        )
                    };
                }
            });
            
            // Recalculate totals
            get().calculateTotals();
            toast.success("Cart updated");
            
        } catch (error) {
            console.error("Update quantity error:", error);
            toast.error(error.response?.data?.message || "Failed to update quantity");
            
            // Optionally refresh cart from server on error
            get().getCartProducts();
        }
    },

    // clearing the cart 
    clearCart: async () => {
        try {
            await axios.delete("/api/cart/clearCart");
            set({ cart: [], total: 0, subtotal: 0, totalQuantity: 0 });
            toast.success("Cart cleared");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to clear cart");
        }
    },

    calculateTotals: () => {
        const { cart } = get();
        const subtotal = cart.reduce((sum, item) => {
            const price = item.productPrice || item.price || 0;
            return sum + price * item.quantity;
        }, 0);
        
        // Calculate total quantity
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        let total = subtotal;

        set({ subtotal, total, totalQuantity });
    },

}));

export default useCartStore;