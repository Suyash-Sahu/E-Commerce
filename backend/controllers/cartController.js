const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

// @desc    Get all cart items
// @route   GET /api/cart
// @access  Public
const getCartItems = async (req, res) => {
  try {
    const cartItems = await CartItem.find({}).populate('productId');
    const total = cartItems.reduce((sum, item) => {
      // Check if productId exists and has a price
      if (item.productId && item.productId.price) {
        return sum + (item.productId.price * item.qty);
      }
      return sum;
    }, 0);
    
    res.json({
      items: cartItems,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Public
const addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if item already in cart
    let cartItem = await CartItem.findOne({ productId });
    
    if (cartItem) {
      // Update quantity
      cartItem.qty = qty;
      await cartItem.save();
    } else {
      // Create new cart item
      cartItem = new CartItem({
        productId,
        qty
      });
      await cartItem.save();
    }
    
    res.status(201).json({ message: 'Item added to cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Public
const removeFromCart = async (req, res) => {
  try {
    const cartItem = await CartItem.findById(req.params.id);
    
    if (cartItem) {
      await CartItem.deleteOne({ _id: req.params.id });
      res.json({ message: 'Item removed from cart' });
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCartItems,
  addToCart,
  removeFromCart
};