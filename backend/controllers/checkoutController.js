const Order = require('../models/Order');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

// @desc    Process checkout
// @route   POST /api/checkout
// @access  Public
const processCheckout = async (req, res) => {
  try {
    const { cartItems, user } = req.body;
    
    // Validate user data
    if (!user.name || !user.email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
    
    // Calculate total based on actual product prices
    let total = 0;
    const items = [];
    
    // Validate cart items and calculate total
    for (const item of cartItems) {
      if (!item.productId || !item.qty) {
        return res.status(400).json({ message: 'Invalid cart item data' });
      }
      
      // Fetch the actual product to get the real price
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ message: `Product with ID ${item.productId} not found` });
      }
      
      // Add item to order
      items.push({
        productId: item.productId,
        qty: item.qty
      });
      
      // Calculate total based on actual product price
      total += product.price * item.qty;
    }
    
    // Create order
    const order = new Order({
      items,
      total,
      user
    });
    
    const createdOrder = await order.save();
    
    // Clear cart after successful checkout
    await CartItem.deleteMany({});
    
    // Create receipt
    const receipt = {
      total: total,
      timestamp: new Date().toISOString(),
      message: 'Checkout successful'
    };
    
    res.status(201).json({
      receipt
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  processCheckout
};