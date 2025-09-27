import express from 'express';
import { createProduct, getAllProducts, deleteProduct, updateProduct, getFeaturedProducts, getProductId,toggleFeaturedProduct, getRecommendedProducts, getProductsByCategory} from '../controllers/product.controller.js';
import { protectRoute, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();


//!Admin routes 
router.post('/create', protectRoute, authorize("admin"), createProduct);
router.get('/',protectRoute, authorize("admin"), getAllProducts);
router.put('/:id', protectRoute, authorize("admin"), updateProduct)
router.delete('/:id',protectRoute, authorize("admin"),  deleteProduct);
router.put("/:id/toggle-featured", protectRoute, authorize("admin"), toggleFeaturedProduct);

//^ Public Routes 
router.get('/all', getAllProducts);
router.get("/getFeatured", getFeaturedProducts);
router.get("/recommended", getRecommendedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/:id", getProductId);

export default router;