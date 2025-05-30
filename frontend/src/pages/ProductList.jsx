import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('newest');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [category, sort]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (category !== 'all') params.append('category', category);
      if (searchTerm) params.append('search', searchTerm);
      if (sort) params.append('sort', sort);

      const response = await axios.get(`https://customer-connect-deploy.onrender.com/api/products?${params}`);
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item.product._id === product._id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.product._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter(item => item.product._id !== productId));
  };

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;
    
    setCart(cart.map(item =>
      item.product._id === productId
        ? { ...item, quantity }
        : item
    ));
  };

  const handleSubmitOrder = async () => {
    try {
      const orderItems = cart.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      }));

      await axios.post('http://localhost:5000/api/orders', { items: orderItems });
      setCart([]);
      alert('Order submitted successfully!');
    } catch (err) {
      setError('Failed to submit order');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h1>Products</h1>
        <div className="cart-summary">
          <span>{cart.length} items in cart</span>
          <button
            className="btn btn-primary"
            onClick={handleSubmitOrder}
            disabled={cart.length === 0}
          >
            Submit Order
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="product-list-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="filter-box">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-input"
          >
            <option value="all">All Categories</option>
            <option value="groceries">Groceries</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
          </select>
        </div>
        <div className="sort-box">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="form-input"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="product-list">
        {products.length === 0 ? (
          <div className="no-products">
            <p>No products found</p>
          </div>
        ) : (
          products.map(product => (
            <div key={product._id} className="product-card">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
              )}
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <p className="product-stock">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </p>
              </div>
              <div className="product-actions">
                {cart.find(item => item.product._id === product._id) ? (
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(
                        product._id,
                        cart.find(item => item.product._id === product._id).quantity - 1
                      )}
                    >
                      -
                    </button>
                    <span>
                      {cart.find(item => item.product._id === product._id).quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(
                        product._id,
                        cart.find(item => item.product._id === product._id).quantity + 1
                      )}
                    >
                      +
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemoveFromCart(product._id)}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList; 