import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './CustomerList.css';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('https://customer-connect-deploy.onrender.com/api/customers');
      setCustomers(response.data);
    } catch (err) {
      setError('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || customer.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="customer-list-container">
      <div className="customer-list-header">
        <h1>Customers</h1>
        <Link to="/customers/new" className="btn btn-primary">Add Customer</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="customer-list-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="filter-box">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="form-input"
          >
            <option value="all">All Customers</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="customer-list">
        {filteredCustomers.length === 0 ? (
          <div className="no-customers">
            <p>No customers found</p>
          </div>
        ) : (
          filteredCustomers.map(customer => (
            <div key={customer._id} className="customer-card">
              <div className="customer-info">
                <h3>{customer.name}</h3>
                <p className="customer-email">{customer.email}</p>
                <p className="customer-phone">{customer.phone}</p>
              </div>
              <div className="customer-status">
                <span className={`status-badge ${customer.status}`}>
                  {customer.status}
                </span>
              </div>
              <div className="customer-actions">
                <Link
                  to={`/customers/${customer._id}`}
                  className="btn btn-secondary"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomerList; 