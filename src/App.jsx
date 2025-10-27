import { useState, useEffect } from 'react';
import './App.css';
import ProductCard from './components/ProductCard';
import CartView from './components/CartView';
import CheckoutModal from './components/CheckoutModal';
import ReceiptModal from './components/ReceiptModal';
import { 
  fetchProducts, 
  fetchCart, 
  addToCart, 
  removeFromCart, 
  updateCartItem, 
  processCheckout,
  calculateTotal
} from './services/api';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState({ products: false, cart: false });
  const [error, setError] = useState({ products: null, cart: null, general: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch products from API
  const loadProducts = async () => {
    try {
      setLoading(prev => ({ ...prev, products: true }));
      setError(prev => ({ ...prev, products: null }));
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError(prev => ({ ...prev, products: err.message }));
      console.error('Error fetching products:', err);
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  // Fetch cart from API
  const loadCart = async () => {
    try {
      setLoading(prev => ({ ...prev, cart: true }));
      setError(prev => ({ ...prev, cart: null }));
      const data = await fetchCart();
      setCart(data.items);
    } catch (err) {
      console.error('Error fetching cart:', err);
      // More detailed error logging
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        setError(prev => ({ 
          ...prev, 
          cart: 'Failed to connect to the server. Please make sure the backend is running on port 5000.' 
        }));
      } else {
        setError(prev => ({ ...prev, cart: err.message }));
      }
      // If API fails, use localStorage as fallback
      const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCart(savedCart);
    } finally {
      setLoading(prev => ({ ...prev, cart: false }));
    }
  };

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  // Save cart to localStorage as fallback
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product._id, 1);
      // Refresh cart
      await loadCart();
    } catch (err) {
      console.error('Error adding to cart:', err);
      // Fallback to local state if API fails
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.productId === product._id);
        if (existingItem) {
          return prevCart.map(item =>
            item.productId === product._id
              ? { ...item, qty: item.qty + 1 }
              : item
          );
        } else {
          return [...prevCart, { productId: product._id, qty: 1, ...product }];
        }
      });
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      // Find the cart item by productId
      const cartItem = cart.find(item => item.productId === productId || item._id === productId);
      
      if (!cartItem) {
        throw new Error('Item not found in cart');
      }
      
      await removeFromCart(cartItem._id || cartItem.productId);
      // Refresh cart
      await loadCart();
    } catch (err) {
      console.error('Error removing from cart:', err);
      // Fallback to local state if API fails
      setCart(prevCart => prevCart.filter(item => item.productId !== productId));
    }
  };

  const handleUpdateQuantity = async (productId, qty) => {
    if (qty <= 0) {
      await handleRemoveFromCart(productId);
      return;
    }
    
    try {
      // Find the cart item by productId
      const cartItem = cart.find(item => item.productId === productId);
      
      if (!cartItem) {
        throw new Error('Item not found in cart');
      }
      
      await updateCartItem(cartItem.productId, qty);
      // Refresh cart
      await loadCart();
    } catch (err) {
      console.error('Error updating quantity:', err);
      // Fallback to local state if API fails
      setCart(prevCart =>
        prevCart.map(item =>
          item.productId === productId ? { ...item, qty } : item
        )
      );
    }
  };

  const handleCheckout = async (userData) => {
    try {
      const data = await processCheckout(
        cart.map(item => ({
          productId: item.productId || item._id,
          qty: item.qty
        })),
        userData
      );
      
      // Create receipt
      const receipt = {
        total: data.receipt.total,
        timestamp: data.receipt.timestamp,
        message: data.receipt.message,
        items: cart
      };
      
      setReceiptData(receipt);
      setShowCheckout(false);
      setShowReceipt(true);
      
      // Clear cart
      setCart([]);
    } catch (err) {
      console.error('Checkout error:', err);
      setError(prev => ({ ...prev, general: 'Checkout failed. Please try again.' }));
      // Show error for a few seconds
      setTimeout(() => {
        setError(prev => ({ ...prev, general: null }));
      }, 5000);
    }
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.qty, 0);
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading.products && products.length === 0) {
    return (
      <div className="app">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="main-header">
        <div className="header-top">
          <div className="logo">
            <h1>ShopEase</h1>
          </div>
          <div className="header-actions">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="search-btn">🔍</button>
            </div>
            <div className="cart-icon" onClick={() => setShowCart(!showCart)}>
              🛒 Cart ({getCartCount()})
            </div>
          </div>
        </div>
        <nav className="main-nav">
          <ul>
            <li><a href="#" className="active">Home</a></li>
            <li><a href="#">Categories</a></li>
            <li><a href="#">Deals</a></li>
            <li><a href="#">New Arrivals</a></li>
            <li><a href="#">Brands</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2>Winter Sale is Live!</h2>
          <p>Up to 50% off on selected items. Limited time offer.</p>
          <button className="cta-button">Shop Now</button>
        </div>
      </section>

      {/* Main Content */}
      <main>
        

        {/* Error message display */}
        {(error.general || error.products || error.cart) && (
          <div className="error-message">
            {error.general && <div>{error.general}</div>}
            {error.products && <div>Products Error: {error.products}</div>}
            {error.cart && <div>Cart Error: {error.cart}</div>}
          </div>
        )}

        {showCart && (
          <CartView 
            cart={cart} 
            onClose={() => setShowCart(false)}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemoveFromCart}
            onCheckout={() => {
              setShowCart(false);
              setShowCheckout(true);
            }}
            calculateTotal={() => calculateTotal(cart)}
          />
        )}

        {showCheckout && (
          <CheckoutModal 
            cart={cart}
            onClose={() => setShowCheckout(false)}
            onCheckout={handleCheckout}
            calculateTotal={() => calculateTotal(cart)}
          />
        )}

        {showReceipt && receiptData && (
          <ReceiptModal 
            receipt={receiptData}
            onClose={() => setShowReceipt(false)}
          />
        )}

        {!showCart && !showCheckout && !showReceipt && (
          <>
            <section className="featured-products">
              <h2>Featured Products</h2>
              {error.products && <div className="error">Error: {error.products}</div>}
              {loading.products && <div className="loading">Loading products...</div>}
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product._id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>ShopEase</h3>
            <p>Your one-stop shop for all electronics and accessories.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">Products</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Customer Service</h4>
            <ul>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Shipping Policy</a></li>
              <li><a href="#">Returns & Exchanges</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact Us</h4>
            <p>Email: support@shopease.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 ShopEase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;