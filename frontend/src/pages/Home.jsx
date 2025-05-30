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
          <h1>Welcome to CConnect</h1>
          <p>Your all-in-one customer management solution</p>
          {!user && (
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">Get Started</Link>
              <Link to="/login" className="btn btn-secondary">Login</Link>
            </div>
          )}
        </div>
      </section>

      <section className="features">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Customer Management</h3>
            <p>Easily manage and track your customer relationships</p>
          </div>
          <div className="feature-card">
            <h3>Analytics</h3>
            <p>Get insights into your customer data and business performance</p>
          </div>
          <div className="feature-card">
            <h3>Reports</h3>
            <p>Generate detailed reports and export them in various formats</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to get started?</h2>
        <p>Join thousands of businesses using CConnect</p>
        {!user && (
          <Link to="/register" className="btn btn-primary">Sign Up Now</Link>
        )}
      </section>
    </div>
  );
};

export default Home; 