import { useState, useEffect } from 'react';
import { ordersAPI } from '../api';
import { Navigate } from 'react-router-dom';
import { playNotificationSound } from '../utils/sound';

export default function Orders({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastOrder, setToastOrder] = useState(null);

  useEffect(() => {
    if (orders.length === 0) return;
    const interval = setInterval(() => {
        const now = new Date();
        const arrived = orders.find(o => o.status === 'out_for_delivery' && new Date(o.estimatedDeliveryTime) <= now);
        if (arrived && (!toastOrder || toastOrder.id !== arrived.id)) {
            setToastOrder(arrived);
            playNotificationSound();
        }
    }, 1000); // Check every second
    return () => clearInterval(interval);
  }, [orders, toastOrder]);

  const handleMarkDelivered = async (orderId) => {
      try {
          await ordersAPI.updateStatus(orderId, 'delivered');
          setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'delivered' } : o));
          if (toastOrder && toastOrder.id === orderId) setToastOrder(null);
      } catch(err) {
          console.error("Failed to update status", err);
      }
  };

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const res = await ordersAPI.getUserOrders(user.id);
        setOrders(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load orders', err);
        setLoading(false);
      }
    };
    
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 3000);
    return () => clearInterval(intervalId);
  }, [user]);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading your orders...</div>;

  return (
    <section className="container">
      <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Order History</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Track your cravings.</p>
      
      {orders.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>You have no orders yet.</p>
      ) : (
        <div>
          {orders.map(order => (
            <div className="order-row" key={order.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>Order #{order.id}</span>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                  ₹{order.totalAmount.toFixed(2)}
                </span>
              </div>
              {order.paymentMode && (
                <p style={{ color: 'var(--text-secondary)', marginBottom: '0.2rem', fontSize: '0.95rem', fontWeight: 600 }}>
                  Payment: {order.paymentMode}
                </p>
              )}
              <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                Placed: {new Date(order.createdAt).toLocaleString()}
              </p>
              
              <p style={{ marginBottom: '1.5rem', fontWeight: 600 }}>
                Items: {order.OrderItems?.map(oi => `${oi.quantity}x ${oi.MenuItem ? oi.MenuItem.name : 'Item'}`).join(', ')}
              </p>

              <div className="map-tracker">
                 <div className="map-line"></div>
                 <div className="map-progress" style={{ width: order.status === 'delivered' ? '100%' : order.status === 'preparing' ? '50%' : '10%' }}></div>
                 
                 <div className="rider-icon" style={{ left: order.status === 'delivered' ? '90%' : order.status === 'preparing' ? '50%' : '10%' }}>🛵</div>

                 <div className="map-node active" style={{ left: 0 }}>
                    🏪
                    <span className="map-label">Store</span>
                 </div>

                 <div className={`map-node ${order.status === 'delivered' || order.status === 'preparing' ? 'active' : ''}`} style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                    <span style={{ fontSize: '1.2rem' }}>📍</span>
                    <span className="map-label">Transit</span>
                 </div>

                 <div className={`map-node ${order.status === 'delivered' ? 'active' : ''}`} style={{ right: 0 }}>
                    🏠
                    <span className="map-label">Home</span>
                 </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span className={`tracker-status status-${order.status}`}>
                    {order.status.toUpperCase()}
                  </span>
                  {order.status === 'out_for_delivery' && order.estimatedDeliveryTime && new Date(order.estimatedDeliveryTime) <= new Date() && (
                     <button 
                       onClick={() => handleMarkDelivered(order.id)}
                       className="toast-btn" style={{ marginLeft: '1rem', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                     >
                       Mark as Received
                     </button>
                  )}
                </div>
                {order.estimatedDeliveryTime && order.status !== 'delivered' && (
                  <span style={{ color: 'var(--primary)', fontWeight: 800 }}>
                    ETA: {new Date(order.estimatedDeliveryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
                {order.status === 'delivered' && (
                  <span style={{ color: 'var(--primary)', fontWeight: 800 }}>Delivered</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {toastOrder && (
          <div className="delivery-toast">
              <h4 style={{ margin: 0, fontSize: '1.2rem' }}>🎉 Your Order Has Arrived!</h4>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Order #{toastOrder.id} has reached your location.</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                    className="toast-btn"
                    onClick={() => handleMarkDelivered(toastOrder.id)}
                >
                    Yes, I Received It!
                </button>
                <button onClick={() => setToastOrder(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 'bold' }}>Close</button>
              </div>
          </div>
      )}
    </section>
  );
}
