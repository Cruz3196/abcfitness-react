import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const useCartStore = create((set, get) => ({
    // State
    cart: [],
    total: 0,
    subtotal: 0, 
    isLoading: false,

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
            // Send productId as URL parameter, not body
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

    // Add missing updateQuantity function
    updateQuantity: async (productId, quantity) => {
        try {
            await axios.put(`/api/cart/updateQuantity/${productId}`, { quantity });
            
            if (quantity === 0) {
                // Remove item if quantity is 0
                set((prevState) => ({
                    cart: prevState.cart.filter((item) => item._id !== productId)
                }));
            } else {
                // Update quantity
                set((prevState) => ({
                    cart: prevState.cart.map((item) =>
                        item._id === productId ? { ...item, quantity } : item
                    )
                }));
            }
            get().calculateTotals();
            toast.success("Cart updated");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update quantity");
        }
    },

    // clearing the cart 
    clearCart: async () => {
        try {
            await axios.delete("/api/cart/clearCart");
            set({ cart: [], total: 0, subtotal: 0 });
            toast.success("Cart cleared");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to clear cart");
        }
    },

    calculateTotals: () => {
        const { cart } = get();
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        let total = subtotal;

        set({ subtotal, total });
    },

}));

export default useCartStore;