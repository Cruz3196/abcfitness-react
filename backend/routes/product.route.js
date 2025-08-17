import express from 'express';
import { createProduct,getAllProducts } from '../controllers/product.controller.js';

const router = express.Router();

//endpoint for creating a product, this will only be for admin
router.post('/create', createProduct);
//getting all products
router.get('/all', getAllProducts);

export default router;