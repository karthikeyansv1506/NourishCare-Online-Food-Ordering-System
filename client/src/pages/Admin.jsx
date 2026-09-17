import { useState, useEffect, useRef } from 'react';
import { ordersAPI } from '../api';
import { Navigate } from 'react-router-dom';
import { playNotificationSound } from '../utils/sound';

export default function Admin({ user }) {
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const lastSeenOrderIdRef = useRef(0);

  // Poll for new orders every 5 seconds
  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    
    const fetchAllOrders = async () => {
      try {
        const res = await ordersAPI.getAllOrders();
        
        if (res.data.length > 0) {
            const maxId = Math.max(...res.data.map(o => o.id));
            if (lastSeenOrderIdRef.current > 0 && maxId > lastSeenOrderIdRef.current) {
                playNotificationSound();
            }
            if (maxId > lastSeenOrderIdRef.current) {
                lastSeenOrderIdRef.current = maxId;
            }
        }
        
        setAllOrders(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load all orders', err);
        setLoading(false);
      }
    };
    
    fetchAllOrders(); // Initial fetch
    
    const interval = setInterval(() => {
        fetchAllOrders();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [user]);

  const handleUpdateStatus = async (orderId, newStatus) => {
      try {
          await ordersAPI.updateStatus(orderId, newStatus);
          // Optimistically update UI
          setAllOrders(allOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      } catch(err) {
          console.error("Failed to update status", err);
          alert('Failed to update status.');
      }
  };

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading Admin Dashboard...</div>;

  return (
    <section className="container" style={{ maxWidth: '1400px' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Admin Dashboard</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Live tracking of all incoming orders.</p>
      
      {allOrders.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '12px' }}>No orders have been placed yet.</p>
      ) : (
        <div className="admin-grid">
          {allOrders.map(order => (
            <div className={`admin-card status-border-${order.status}`} key={order.id}>
              <div className="admin-card-header">
                <div>
                   <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Order #{order.id}</h3>
                   <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                     {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--primary)' }}>₹{order.totalAmount.toFixed(2)}</div>
                   <span style={{ fontSize: '0.85rem', fontWeight: 600, background: '#EDF2F7', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                     {order.paymentMode}
                   </span>
                </div>
              </div>
              
              <div style={{ margin: '1rem 0', padding: '1rem', background: '#F7FAFC', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Customer Details</h4>
                <div style={{ fontSize: '0.95rem', marginBottom: '0.2rem' }}><strong>Name:</strong> {order.User ? order.User.name : 'Unknown'}</div>
                <div style={{ fontSize: '0.95rem', marginBottom: '0.2rem' }}><strong>Email:</strong> {order.User ? order.User.email : 'Unknown'}</div>
                <div style={{ fontSize: '0.95rem' }}><strong>Address:</strong> {order.deliveryAddress}</div>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Order Items</h4>
                <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                  {order.OrderItems?.map((oi, idx) => (
                    <li key={idx} style={{ marginBottom: '0.3rem', display: 'flex', justifyContent: 'space-between' }}>
                       <span>{oi.quantity}x {oi.MenuItem ? oi.MenuItem.name : 'Item'}</span>
                       <span>₹{(oi.price * oi.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div>
                    <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Current Status</span>
                    <span className={`tracker-status status-${order.status}`} style={{ margin: 0 }}>
                      {order.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                 </div>
                 
                 <div className="admin-actions">
                    {order.status === 'preparing' && (
                       <button className="submit-btn" style={{ padding: '0.6rem 1.2rem', fontSize: '1rem' }} onClick={() => handleUpdateStatus(order.id, 'out_for_delivery')}>
                          Assign to Delivery Agent 🛵
                       </button>
                    )}
                    {order.status === 'out_for_delivery' && (
                       <button style={{ padding: '0.6rem 1.2rem', fontSize: '1rem', background: '#F57C00', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold' }} disabled>
                          Waiting for Customer Receipt...
                       </button>
                    )}
                    {order.status === 'delivered' && (
                       <div style={{ color: '#2E7D32', fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span>✓</span> Payment Received
                       </div>
                    )}
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
