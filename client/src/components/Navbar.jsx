import { NavLink } from 'react-router-dom';

export default function Navbar({ user, cartCount, onLogout, onToggleCart, onShowAuth }) {
  return (
    <header>
      <div className="logo">
        <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Nourish<span>Care</span></NavLink>
      </div>
      <nav>
        <ul>
          <li>
            <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/menu" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              Menu
            </NavLink>
          </li>
          {user && (
            <li>
              <NavLink to="/orders" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                My Orders
              </NavLink>
            </li>
          )}
          {user && user.role === 'admin' && (
            <li>
              <NavLink to="/admin" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} style={{ color: 'var(--accent)' }}>
                Admin Dashboard ⚙️
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
      {user ? (
        <div className="auth-buttons">
          <span style={{ marginRight: '15px', fontWeight: 600 }}>Hello, {user.name.split(' ')[0]}</span>
          <button className="primary" onClick={onToggleCart}>🛒 Cart ({cartCount})</button>
          <button onClick={onLogout}>Logout</button>
        </div>
      ) : (
        <div className="auth-buttons">
          <button onClick={() => onShowAuth('login')}>Login</button>
          <button className="primary" onClick={() => onShowAuth('register')}>Sign Up</button>
        </div>
      )}
    </header>
  );
}
