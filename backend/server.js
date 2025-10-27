const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'E-Commerce API is running' });
});

// Product routes
app.use('/api/products', require('./routes/productRoutes'));

// Cart routes
app.use('/api/cart', require('./routes/cartRoutes'));

// Checkout routes
app.use('/api/checkout', require('./routes/checkoutRoutes'));

// Seed products on startup if database is empty
const Product = require('./models/Product');
const seedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      const mockProducts = [
        {
          name: 'Wireless Headphones',
          price: 1499,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
        },
        {
          name: 'Smart Watch',
          price: 2999,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop'
        },
        {
          name: 'Bluetooth Speaker',
          price: 1299,
          image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop'
        },
        {
          name: 'Gaming Mouse',
          price: 799,
          image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop'
        },
        {
          name: 'Mechanical Keyboard',
          price: 1999,
          image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop'
        },
        {
          name: '4K Monitor',
          price: 15999,
          image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=400&fit=crop'
        }
      ];
      
      await Product.insertMany(mockProducts);
      console.log('Products seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

// Seed products when server starts
mongoose.connection.on('connected', () => {
  seedProducts();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});