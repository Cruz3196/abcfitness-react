import express from 'express';
import { createProduct, getAllProducts, getProductId, deleteProduct} from '../controllers/product.controller.js';
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

//!routes controllers 
//!Public Routes  
router.get('/:id',getProductId)

//!Admin routes 
router.get('/all',protectRoute, adminRoute, getAllProducts);
router.post('/create', protectRoute, adminRoute, createProduct);
router.delete('/:id',protectRoute, adminRoute,  deleteProduct);

export default router;