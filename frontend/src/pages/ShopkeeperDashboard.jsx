import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import './ShopkeeperDashboard.css';

const ShopkeeperDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch orders
      const ordersResponse = await fetch('https://customer-connect-deploy.onrender.com/api/orders/shopkeeper', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Fetch products
      const productsResponse = await fetch('https://customer-connect-deploy.onrender.com/api/products', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!ordersResponse.ok || !productsResponse.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const ordersData = await ordersResponse.json();
      const productsData = await productsResponse.json();

      setOrders(ordersData);
      setProducts(productsData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`https://customer-connect-deploy.onrender.com/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status. Please try again.');
    }
  };

  const updateProductAvailability = async (productId, available) => {
    if (!productId) {
      setError('Invalid product data');
      return;
    }

    try {
      setError(null);
      const response = await fetch(`https://customer-connect-deploy.onrender.com/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ available })
      });

      if (!response.ok) {
        throw new Error('Failed to update product availability');
      }

      // Update local state
      setProducts(products.map(product =>
        product.id === productId ? { ...product, available } : product
      ));
    } catch (err) {
      console.error('Error updating product availability:', err);
      setError(err.response?.data?.message || 'Failed to update product availability');
    }
  };

  const updateProductPrice = async (productId, price) => {
    if (!productId || isNaN(price) || price < 0) {
      setError('Invalid price data');
      return;
    }

    try {
      setError(null);
      const response = await fetch(`https://customer-connect-deploy.onrender.com/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ price })
      });

      if (!response.ok) {
        throw new Error('Failed to update product price');
      }

      // Update local state
      setProducts(products.map(product =>
        product.id === productId ? { ...product, price } : product
      ));
    } catch (err) {
      console.error('Error updating product price:', err);
      setError(err.response?.data?.message || 'Failed to update product price');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>{error}</p>
        <button onClick={fetchDashboardData} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="shopkeeper-dashboard">
      <div className="welcome-section">
        <h1>Welcome, {user?.name || 'Shopkeeper'}!</h1>
        <p className="welcome-message">
          Manage your orders and products from your dashboard.
        </p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/products" className="btn btn-primary">
              Manage Products
            </Link>
            <Link to="/customers" className="btn btn-secondary">
              View Customers
            </Link>
            <Link to="/analytics" className="btn btn-secondary">
              View Analytics
            </Link>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Recent Orders</h2>
          <div className="orders-list">
            {orders.length === 0 ? (
              <p className="empty-state">No orders yet</p>
            ) : (
              orders.map(order => (
                <div key={order.id} className="order-item">
                  <div className="order-header">
                    <h3>Order #{order.id}</h3>
                    <span className={`status-badge ${order.status}`}>
                      {order.status}
                    </span>
                  </div>
                  <p>Customer: {order.customerName}</p>
                  <p>Total: ${order.totalAmount.toFixed(2)}</p>
                  <div className="order-actions">
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'confirmed')}
                          className="btn btn-success"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'rejected')}
                          className="btn btn-danger"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'packed')}
                        className="btn btn-primary"
                      >
                        Mark as Packed
                      </button>
                    )}
                    {order.status === 'packed' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'collected')}
                        className="btn btn-success"
                      >
                        Mark as Collected
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Product Overview</h2>
          <div className="product-stats">
            <div className="stat-item">
              <h3>Total Products</h3>
              <p>{products.length}</p>
            </div>
            <div className="stat-item">
              <h3>Active Products</h3>
              <p>{products.filter(p => p.available).length}</p>
            </div>
          </div>
          <Link to="/products" className="btn btn-primary">
            Manage Products
          </Link>
        </div>

        <div className="dashboard-card">
          <h2>Support</h2>
          <div className="support-info">
            <p>Need help managing your shop?</p>
            <p>Contact support at: support@customerconnect.com</p>
            <p>Phone: (555) 123-4567</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopkeeperDashboard; 