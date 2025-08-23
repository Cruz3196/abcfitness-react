import express from 'express';
import { createProduct,getAllProducts, getProductId, deleteProduct}
from '../controllers/product.controller.js';

const router = express.Router();

//getting all products
router.get('/', getAllProducts);
//get product by id 
router.get('/:id',getProductId)
//endpoint for creating a product, this will only be for admin
router.post('/create', createProduct);
// deleting a product by id endpoint
router.delete('/:id', deleteProduct);

export default router;