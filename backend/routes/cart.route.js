import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getCartProducts, addToCart, updateQuantity, removeFromCart } from '../controllers/cart.controller.js';


const router = express.Router();

// Cart routes
router.get("/cartProducts", protectRoute, getCartProducts);
router.post("/addToCart", protectRoute, addToCart);
router.put("/:productId", protectRoute, updateQuantity);
router.delete("/removeFromCart/:productId", protectRoute, removeFromCart);

export default router;