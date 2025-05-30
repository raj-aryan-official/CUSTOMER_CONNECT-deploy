import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shopkeepers, setShopkeepers] = useState([]);
  const [selectedShopkeeper, setSelectedShopkeeper] = useState('');
  const [showShopkeeperModal, setShowShopkeeperModal] = useState(false);

  useEffect(() => {
    fetchShopkeepers();
  }, []);

  const fetchShopkeepers = async () => {
    try {
      const response = await fetch('https://customer-connect-deploy.onrender.com/api/users/shopkeepers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch shopkeepers');
      }
      const data = await response.json();
      setShopkeepers(data);
    } catch (err) {
      console.error('Error fetching shopkeepers:', err);
      setError('Failed to load shopkeepers. Please try again.');
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!selectedShopkeeper) {
      setShowShopkeeperModal(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const orderData = {
        customerId: user.id,
        shopkeeperId: selectedShopkeeper,
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: getCartTotal(),
        status: 'pending'
      };

      const response = await fetch('https://customer-connect-deploy.onrender.com/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      // Clear the cart after successful order placement
      clearCart();
      navigate('/orders');
    } catch (err) {
      console.error('Error placing order:', err);
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <p>Add some products to your cart to continue shopping.</p>
        <button onClick={() => navigate('/groceries')} className="btn btn-primary">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <div className="item-image">
              <img src={item.thumbnail} alt={item.title} />
            </div>
            <div className="item-details">
              <h3>{item.title}</h3>
              <p className="item-price">${item.price.toFixed(2)}</p>
              <div className="quantity-controls">
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
            </div>
            <div className="item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="remove-btn"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>${getCartTotal().toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Shipping:</span>
          <span>Free</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>${getCartTotal().toFixed(2)}</span>
        </div>
        <button
          onClick={handlePlaceOrder}
          className="btn btn-primary place-order-btn"
          disabled={loading}
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>

      {showShopkeeperModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Select a Shopkeeper</h2>
            <div className="shopkeeper-list">
              {shopkeepers.map(shopkeeper => (
                <div
                  key={shopkeeper.id}
                  className={`shopkeeper-item ${selectedShopkeeper === shopkeeper.id ? 'selected' : ''}`}
                  onClick={() => setSelectedShopkeeper(shopkeeper.id)}
                >
                  <h3>{shopkeeper.name}</h3>
                  <p>{shopkeeper.email}</p>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button
                onClick={() => setShowShopkeeperModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowShopkeeperModal(false);
                  handlePlaceOrder();
                }}
                className="btn btn-primary"
                disabled={!selectedShopkeeper}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart; 