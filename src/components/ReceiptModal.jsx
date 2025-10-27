import React from 'react';

const ReceiptModal = ({ receipt, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal receipt-modal">
        <div className="modal-header">
          <h2>Order Receipt</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="receipt-content">
            <h3>Thank You for Your Purchase!</h3>
            <p>{receipt.message}</p>
            
            <div className="receipt-details">
              <p><strong>Order Total:</strong> ₹{receipt.total}</p>
              <p><strong>Timestamp:</strong> {new Date(receipt.timestamp).toLocaleString()}</p>
            </div>
            
            <div className="receipt-items">
              <h4>Items Purchased:</h4>
              {receipt.items.map(item => (
                <div key={item._id || item.productId} className="receipt-item">
                  <span>{item.productId?.name || item.name} x {item.qty}</span>
                  <span>₹{(item.productId?.price || item.price) * item.qty}</span>
                </div>
              ))}
            </div>
            
            <button className="continue-btn" onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;