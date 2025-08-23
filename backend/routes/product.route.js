import express from 'express';
import { createProduct, getAllProducts, getProductId, deleteProduct}
from '../controllers/product.controller.js';

const router = express.Router();

//getting all products, this will eventually be done only by admin
router.get('/all', getAllProducts);
//get product by id
router.get('/:id',getProductId)
//endpoint for creating a product, this will only be for admin
router.post('/create', createProduct);
// updating a product by id endpoint, this will be done only by admin
// router.patch('/:id', updateProduct)
// deleting a product by id endpoint
router.delete('/:id', deleteProduct);

export default router;