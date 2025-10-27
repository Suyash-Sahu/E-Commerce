import React from 'react';

const CartView = ({ cart, onClose, onUpdateQuantity, onRemove, onCheckout, calculateTotal }) => {
  return (
    <div className="modal-overlay">
      <div className="modal cart-modal">
        <div className="modal-header">
          <h2>Shopping Cart</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <React.Fragment>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item._id || item.productId} className="cart-item">
                    <img src={item.productId?.image || item.image} alt={item.productId?.name || item.name} />
                    <div className="item-details">
                      <h3>{item.productId?.name || item.name}</h3>
                      <p>₹{item.productId?.price || item.price}</p>
                    </div>
                    <div className="quantity-controls">
                      <button onClick={() => onUpdateQuantity(item.productId || item._id, item.qty - 1)}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => onUpdateQuantity(item.productId || item._id, item.qty + 1)}>+</button>
                    </div>
                    <button className="remove-btn" onClick={() => onRemove(item.productId || item._id)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="cart-summary">
                <div className="total">
                  <strong>Total: ₹{calculateTotal()}</strong>
                </div>
                <button className="checkout-btn" onClick={onCheckout}>
                  Proceed to Checkout
                </button>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartView;