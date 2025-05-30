import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Customer Connect</h1>
          <p>Your one-stop shop for all your grocery needs</p>
          {!user && (
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">Get Started</Link>
              <Link to="/login" className="btn btn-secondary">Sign In</Link>
            </div>
          )}
          {user && (
            <Link to="/groceries" className="btn btn-primary">Start Shopping</Link>
          )}
        </div>
      </section>

      <section className="features">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <i className="feature-icon">🚚</i>
            <h3>Fast Delivery</h3>
            <p>Get your groceries delivered to your doorstep within hours</p>
          </div>
          <div className="feature-card">
            <i className="feature-icon">💰</i>
            <h3>Best Prices</h3>
            <p>Competitive prices and regular discounts on all products</p>
          </div>
          <div className="feature-card">
            <i className="feature-icon">⭐</i>
            <h3>Quality Products</h3>
            <p>Carefully selected products from trusted brands</p>
          </div>
          <div className="feature-card">
            <i className="feature-icon">🛡️</i>
            <h3>Secure Shopping</h3>
            <p>Safe and secure payment options for all transactions</p>
          </div>
        </div>
      </section>

      <section className="categories">
        <h2>Shop by Category</h2>
        <div className="categories-grid">
          <Link to="/groceries" className="category-card">
            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e" alt="Groceries" />
            <h3>Groceries</h3>
          </Link>
          <Link to="/groceries" className="category-card">
            <img src="https://images.unsplash.com/photo-1610832958506-aa56368176cf" alt="Fresh Produce" />
            <h3>Fresh Produce</h3>
          </Link>
          <Link to="/groceries" className="category-card">
            <img src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f" alt="Dairy" />
            <h3>Dairy</h3>
          </Link>
          <Link to="/groceries" className="category-card">
            <img src="https://images.unsplash.com/photo-1600271886742-f049cd451bba" alt="Beverages" />
            <h3>Beverages</h3>
          </Link>
        </div>
      </section>

      <section className="cta">
        <div className="cta-content">
          <h2>Ready to Start Shopping?</h2>
          <p>Join thousands of satisfied customers who shop with us daily</p>
          <Link to="/groceries" className="btn btn-primary">Shop Now</Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 