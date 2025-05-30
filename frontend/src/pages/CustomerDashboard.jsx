import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <h1>Welcome, {user?.name || 'Customer'}!</h1>
        <p className="welcome-message">
          We're glad to have you back. Start shopping for your favorite groceries today!
        </p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/groceries" className="btn btn-primary">
              Start Shopping
            </Link>
            <Link to="/orders" className="btn btn-secondary">
              View Orders
            </Link>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Your Recent Orders</h2>
          <div className="recent-orders">
            <p>You haven't placed any orders yet.</p>
            <Link to="/groceries" className="link">
              Start your first order
            </Link>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Special Offers</h2>
          <div className="offers">
            <div className="offer-item">
              <h3>New Customer Discount</h3>
              <p>Get 10% off on your first order!</p>
            </div>
            <div className="offer-item">
              <h3>Free Delivery</h3>
              <p>On orders above $50</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Customer Support</h2>
          <div className="support-info">
            <p>Need help with your order?</p>
            <p>Contact us at: support@customerconnect.com</p>
            <p>Phone: (555) 123-4567</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard; 