import React, { useState } from 'react';

const CheckoutModal = ({ cart, onClose, onCheckout, calculateTotal }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email) {
      onCheckout({ name, email });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal checkout-modal">
        <div className="modal-header">
          <h2>Checkout</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="order-summary">
              <h3>Order Summary</h3>
              {cart.map(item => (
                <div key={item._id || item.productId} className="summary-item">
                  <span>{item.productId?.name || item.name} x {item.qty}</span>
                  <span>₹{(item.productId?.price || item.price) * item.qty}</span>
                </div>
              ))}
              <div className="summary-total">
                <strong>Total: ₹{calculateTotal()}</strong>
              </div>
            </div>
            
            <button type="submit" className="submit-btn">
              Place Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;