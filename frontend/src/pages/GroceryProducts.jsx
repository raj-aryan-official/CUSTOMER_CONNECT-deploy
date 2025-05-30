import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import './GroceryProducts.css';

const GroceryProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroceryProducts();
  }, []);

  const fetchGroceryProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://dummyjson.com/products/category/groceries');
      const data = await response.json();
      
      if (data.products) {
        setProducts(data.products);
      } else {
        throw new Error('No products found');
      }
    } catch (err) {
      console.error('Error fetching grocery products:', err);
      setError('Failed to fetch grocery products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    // Show a success message or notification here
  };

  const handleViewCart = () => {
    navigate('/cart');
  };

  const filteredAndSortedProducts = products
    .filter(product => 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading grocery products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
        <button onClick={fetchGroceryProducts} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grocery-products-container">
      <div className="grocery-header">
        <h1>Grocery Products</h1>
        <div className="grocery-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="sort-box">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>
          <button onClick={handleViewCart} className="btn btn-primary">
            View Cart
          </button>
        </div>
      </div>

      <div className="products-grid">
        {filteredAndSortedProducts.length === 0 ? (
          <div className="empty-state">
            <p>No products found</p>
          </div>
        ) : (
          filteredAndSortedProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.thumbnail} alt={product.title} />
              </div>
              <div className="product-info">
                <h3>{product.title}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-details">
                  <span className="product-price">${product.price.toFixed(2)}</span>
                  <span className="product-stock">Stock: {product.stock}</span>
                </div>
                <div className="product-rating">
                  <span className="rating">Rating: {product.rating}</span>
                  <span className="discount">-{product.discountPercentage}%</span>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="btn btn-primary add-to-cart-btn"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GroceryProducts; 