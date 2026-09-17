import { useState, useEffect } from 'react';
import { menuAPI } from '../api';

export default function Menu({ user, addToCart }) {
  const [items, setItems] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await menuAPI.getAll();
        setItems(res.data);
        
        if (user) {
           const recRes = await menuAPI.getRecommended(user.medicalCondition);
           setRecommended(recRes.data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching menu items:', err);
        setError('Failed to load menu. Is backend running?');
        setLoading(false);
      }
    };
    fetchMenu();
  }, [user]);

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading exquisite dishes...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '3rem', color: '#f44336' }}>{error}</div>;

  return (
    <section className="container">
      <h2 className="section-title">Dietary Menu</h2>
      <p className="section-subtitle">Fresh, wholesome, and perfectly tailored to your health.</p>
      
      {user && recommended.length > 0 && (
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1rem' }}>
            ★ Recommended For You ({user.medicalCondition === 'None' ? 'Popular' : user.medicalCondition})
          </h2>
          <div className="menu-grid">
            {recommended.map(item => (
              <div className="menu-card" key={`rec-${item.id}`}>
                <div className="card-content">
                  <div className="menu-icon">
                    {item.dietaryTags && <span className="diet-tag">{item.dietaryTags.split(',')[0]}</span>}
                    {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="menu-image" /> : '🍽️'}
                  </div>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </div>
                <div className="price-row">
                  <span className="price">₹{item.price.toFixed(2)}</span>
                  <button className="add-btn" onClick={() => addToCart(item)}>Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>All Items</h2>
      <div className="menu-grid">
        {items.map(item => (
          <div className="menu-card" key={item.id}>
            <div className="card-content">
              <div className="menu-icon">
                {item.dietaryTags && <span className="diet-tag">{item.dietaryTags.split(',')[0]}</span>}
                {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="menu-image" /> : '🍽️'}
              </div>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </div>
            <div className="price-row">
              <span className="price">₹{item.price.toFixed(2)}</span>
              <button className="add-btn" onClick={() => addToCart(item)}>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
