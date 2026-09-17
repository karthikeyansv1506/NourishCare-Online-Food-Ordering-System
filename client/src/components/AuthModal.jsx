import { useState } from 'react';
import { authAPI } from '../api';

export default function AuthModal({ type, onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(type === 'login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '', medicalCondition: 'None' });
  const [msg, setMsg] = useState({ text: '', isError: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: 'Processing...', isError: false });
    
    try {
      let res;
      if (isLogin) {
        res = await authAPI.login({ email: formData.email, password: formData.password });
      } else {
        res = await authAPI.register(formData);
      }
      
      onAuthSuccess(res.data.user);
    } catch (error) {
      setMsg({
        text: error.response?.data?.error || 'Authentication failed. Is backend running?',
        isError: true
      });
    }
  };

  return (
    <div className="modal-wrapper">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.8rem', color: 'var(--text-primary)', fontWeight: 800 }}>
          {isLogin ? 'Welcome Back' : 'Create Your Diet Profile'}
        </h3>
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="name" placeholder="E.g., John Doe" required onChange={handleChange} value={formData.name} />
              </div>
              <div className="form-group">
                <label>Delivery Address</label>
                <textarea name="address" rows="2" placeholder="Your residential address" required={!isLogin} onChange={handleChange} value={formData.address}></textarea>
              </div>
              <div className="form-group">
                <label>Dietary/Medical Condition</label>
                <select name="medicalCondition" onChange={handleChange} value={formData.medicalCondition}>
                  <option value="None">None / General Diet</option>
                  <option value="Diabetic">Diabetic (Sugar-Free)</option>
                  <option value="Hypertension">Hypertension (Heart-Healthy)</option>
                  <option value="Weight-Loss">Weight Management</option>
                </select>
              </div>
            </>
          )}
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" required placeholder="you@example.com" onChange={handleChange} value={formData.email} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" required placeholder="••••••••" onChange={handleChange} value={formData.password} />
          </div>
          <button type="submit" className="submit-btn" style={{ marginBottom: '0.5rem' }}>
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
          
          {msg.text && (
            <div className={msg.isError ? 'err-msg' : 'succ-msg'}>{msg.text}</div>
          )}
        </form>
        
        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => { setIsLogin(!isLogin); setMsg({text:'', isError:false}); }}>
            {isLogin ? 'Sign up here' : 'Log in entirely'}
          </span>
        </p>
      </div>
    </div>
  );
}
