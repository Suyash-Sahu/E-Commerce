const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  seedProducts
} = require('../controllers/productController');

router.route('/')
  .get(getProducts)
  .post(createProduct)
  .put(seedProducts); // Special route for seeding products

router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;