const express = require('express');
const router = express.Router();
const { 
  getCartItems, 
  addToCart,
  removeFromCart
} = require('../controllers/cartController');

router.route('/')
  .get(getCartItems)
  .post(addToCart);

router.route('/:id')
  .delete(removeFromCart);

module.exports = router;