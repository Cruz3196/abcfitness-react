import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getCartProducts, addToCart, updateQuantity, removeFromCart, clearCart } from '../controllers/cart.controller.js';


const router = express.Router();

// Cart routes
router.get("/cartProducts", protectRoute, getCartProducts);
router.post("/addToCart", protectRoute, addToCart);
router.put("/updateQuantity/:productId", protectRoute, updateQuantity); 
router.delete("/removeFromCart/:productId", protectRoute, removeFromCart);
router.delete("/clearCart", protectRoute, clearCart); 

export default router;