import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import CartOverlay from './components/CartOverlay';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Orders from './pages/Orders';
import Admin from './pages/Admin';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authType, setAuthType] = useState('login'); // 'login' or 'register'
  const [isCartOpen, setIsCartOpen] = useState(false);

  // State is now loaded from localStorage on init using lazy initialization

  // Save cart to localstorage on change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
  };

  const addToCart = (item) => {
    if (!user) {
      setAuthType('login');
      setIsAuthOpen(true);
      return;
    }
    
    setCart(prev => {
      const existing = prev.find(c => c.menuItemId === item.id);
      if (existing) {
        return prev.map(c => c.menuItemId === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  return (
    <>
      <Navbar 
        user={user} 
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onLogout={handleLogout}
        onToggleCart={() => setIsCartOpen(!isCartOpen)}
        onShowAuth={(type) => { setAuthType(type); setIsAuthOpen(true); }}
      />
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu user={user} addToCart={addToCart} />} />
          <Route path="/orders" element={<Orders user={user} />} />
          <Route path="/admin" element={<Admin user={user} />} />
        </Routes>
      </main>

      {isAuthOpen && (
        <AuthModal 
          type={authType} 
          onClose={() => setIsAuthOpen(false)} 
          onAuthSuccess={handleAuthSuccess} 
        />
      )}

      <CartOverlay 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        user={user}
        clearCart={() => setCart([])}
        onShowAuth={(type) => { setAuthType(type); setIsAuthOpen(true); }}
      />
    </>
  );
}

export default App;
