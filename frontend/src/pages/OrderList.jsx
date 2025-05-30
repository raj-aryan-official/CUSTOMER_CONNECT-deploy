import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderList.css';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`https://customer-connect-deploy.onrender.com/api/orders?status=${filter}`);
      setOrders(response.data);
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'badge-warning';
      case 'processing':
        return 'badge-info';
      case 'completed':
        return 'badge-success';
      case 'cancelled':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="order-list-container">
      <div className="order-list-header">
        <h1>My Orders</h1>
        <div className="order-filters">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="form-input"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>No orders found</p>
        </div>
      ) : (
        <div className="order-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order._id.slice(-6)}</h3>
                  <p className="order-date">{formatDate(order.createdAt)}</p>
                </div>
                <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              <div className="order-items">
                {order.items.map(item => (
                  <div key={item._id} className="order-item">
                    <div className="item-info">
                      <h4>{item.product.name}</h4>
                      <p className="item-price">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="item-quantity">
                      <span>Quantity: {item.quantity}</span>
                      <span className="item-total">
                        Total: ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <span>Total Amount:</span>
                  <span className="total-amount">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
                {order.status === 'pending' && (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleCancelOrder(order._id)}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList; 