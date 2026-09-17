import { useState } from 'react';
import { ordersAPI } from '../api';
import { useNavigate } from 'react-router-dom';

export default function CartOverlay({ isOpen, onClose, cart, user, clearCart, onShowAuth }) {
  const [msg, setMsg] = useState({ text: '', isError: false });
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Set default address when user opens cart
  if (user && user.address && !deliveryAddress && isOpen) {
    setDeliveryAddress(user.address);
  }

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!user) {
      onClose();
      onShowAuth('login');
      return;
    }

    if (!deliveryAddress.trim()) {
      setMsg({ text: 'Please provide a delivery address.', isError: true });
      return;
    }

    setMsg({ text: 'Processing your order...', isError: false });

    try {
      await ordersAPI.create({
        userId: user.id,
        items: cart,
        totalAmount: total,
        deliveryAddress,
        paymentMode: paymentMethod
      });
      
      setShowSuccessAnim(true);
      clearCart();
      setTimeout(() => {
        onClose();
        setShowSuccessAnim(false);
        setMsg({ text: '', isError: false });
        navigate('/orders');
      }, 2000);
      
    } catch (err) {
      console.error('Order placement failed:', err);
      setMsg({ text: 'Failed to place order.', isError: true });
    }
  };

  return (
    <div className={`cart-overlay ${isOpen ? 'open' : ''}`}>
      <div className="cart-header">
        <h3>Your Cart</h3>
        <button className="close-cart" onClick={onClose}>&times;</button>
      </div>
      
      <div className="cart-items">
        {cart.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '2rem' }}>Your cart is empty.</p>
        ) : (
          cart.map((item, idx) => (
            <div className="cart-item" key={idx}>
              <div>
                <div style={{ fontWeight: 600 }}>{item.name} × {item.quantity}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {cart.length > 0 && user && (
        <div style={{ padding: '1rem 0', borderTop: '1px solid var(--border-color)' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Payment Mode:</label>
            <select 
               value={paymentMethod}
               onChange={(e) => setPaymentMethod(e.target.value)}
               style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '1rem', outline: 'none', background: '#fff', fontSize: '1rem' }}
            >
               <option value="Cash on Delivery">Cash on Delivery</option>
               <option value="Credit/Debit Card">Credit/Debit Card</option>
               <option value="UPI">UPI</option>
            </select>

            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Deliver to:</label>
            <textarea 
               value={deliveryAddress}
               onChange={(e) => setDeliveryAddress(e.target.value)}
               rows="2"
               style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
               placeholder="Enter delivery address..."
            ></textarea>
        </div>
      )}

      <div className="cart-footer">
        <div className="cart-total">
          <span>Total:</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        <button className="submit-btn" onClick={handleCheckout}>Checkout ➔</button>
        {msg.text && (
          <div className={msg.isError ? 'err-msg' : 'succ-msg'}>{msg.text}</div>
        )}
      </div>
      {showSuccessAnim && (
        <div className="order-success-overlay">
           <div className="success-checkmark">✓</div>
           <div className="success-text">Order Confirmed!</div>
        </div>
      )}
    </div>
  );
}
