import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [role, setRole] = useState("customer");
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const loginData = {
        email: formData.email.trim(),
        password: formData.password,
        role: role
      };
      console.log('Login Component: Sending login data:', loginData);
      
      const user = await login(loginData);
      console.log('Login Component: Login successful, user data:', user);
      
      // Redirect based on role
      if (user.role === "shopkeeper") {
        navigate("/shopkeeperdashboard");
      } else {
        navigate("/customerdashboard");
      }
    } catch (err) {
      console.error('Login Component: Login error:', err);
      setError(err.message || "Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login</h1>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role" className="form-label">Role</label>
            <select
              id="role"
              name="role"
              className="form-input"
              value={role}
              onChange={e => setRole(e.target.value)}
              required
            >
              <option value="customer">Customer</option>
              <option value="shopkeeper">Shopkeeper</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? <div className="spinner"></div> : 'Login'}
          </button>
        </form>
        <p className="auth-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;