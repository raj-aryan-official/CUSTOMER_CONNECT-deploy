import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          Customer Connect
        </Link>

        <nav className="nav-menu">
          {user ? (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/groceries" className="nav-link">Shop</Link>
              <Link to="/orders" className="nav-link">Orders</Link>
              {user.role === 'shopkeeper' && (
                <>
                  <Link to="/products" className="nav-link">Products</Link>
                  <Link to="/customers" className="nav-link">Customers</Link>
                  <Link to="/analytics" className="nav-link">Analytics</Link>
                  <Link to="/reports" className="nav-link">Reports</Link>
                </>
              )}
              <div className="user-menu">
                <span className="user-name">Welcome, {user.name}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header; 