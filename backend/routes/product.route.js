import express from 'express';
import { createProduct, getAllProducts, getProductId, deleteProduct, updateProduct} from '../controllers/product.controller.js';
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

//!Public Routes  
router.get('/:id',getProductId)

//!Admin routes 
router.get('/',protectRoute, adminRoute, getAllProducts);
router.put('/:id', protectRoute, adminRoute, updateProduct)
router.post('/create', protectRoute, adminRoute, createProduct);
router.delete('/:id',protectRoute, adminRoute,  deleteProduct);

//? Customer & Admin Routes 
router.get('/:id',getProductId);

//^ Customer Routes 


export default router;