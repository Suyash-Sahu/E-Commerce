const API_BASE_URL = 'http://localhost:5000';

// Fetch products from API
export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('API Error in fetchProducts:', error);
    throw error;
  }
};

// Fetch cart from API
export const fetchCart = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cart`);
    if (!response.ok) {
      throw new Error(`Failed to fetch cart: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('API Error in fetchCart:', error);
    throw error;
  }
};

// Add item to cart
export const addToCart = async (productId, qty) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId,
        qty
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add item to cart: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('API Error in addToCart:', error);
    throw error;
  }
};

// Remove item from cart
export const removeFromCart = async (cartItemId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cart/${cartItemId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to remove item from cart: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('API Error in removeFromCart:', error);
    throw error;
  }
};

// Update item quantity
export const updateCartItem = async (productId, qty) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId,
        qty
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update item quantity: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('API Error in updateCartItem:', error);
    throw error;
  }
};

// Process checkout
export const processCheckout = async (cartItems, user) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cartItems,
        user
      })
    });
    
    if (!response.ok) {
      throw new Error(`Checkout failed: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('API Error in processCheckout:', error);
    throw error;
  }
};

// Calculate total
export const calculateTotal = (cart) => {
  return cart.reduce((total, item) => {
    const price = item.productId?.price || item.price || 0;
    return total + (price * item.qty);
  }, 0);
};