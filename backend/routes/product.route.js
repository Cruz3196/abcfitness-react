import express from 'express';
import { createProduct, getAllProducts, deleteProduct, updateProduct, getFeaturedProducts, getProductId,toggleFeaturedProduct, getRecommendedProducts, getProductsByCategory} from '../controllers/product.controller.js';
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();


//!Admin routes 
router.post('/create', protectRoute, adminRoute, createProduct);
router.get('/',protectRoute, adminRoute, getAllProducts);
router.put('/:id', protectRoute, adminRoute, updateProduct)
router.delete('/:id',protectRoute, adminRoute,  deleteProduct);
router.put("/:id/toggle-featured", protectRoute, adminRoute, toggleFeaturedProduct);

//^ Public Routes 
router.get('/all', getAllProducts);
router.get("/getFeatured", getFeaturedProducts);
router.get("/recommended", getRecommendedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/:id", getProductId);

export default router;