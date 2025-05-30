import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const CustomerDetail = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchCustomer = async () => {
      try {
        // Simulated API call
        const response = await new Promise(resolve => 
          setTimeout(() => resolve({
            id,
            name: 'John Doe',
            email: 'john@example.com',
            phone: '123-456-7890',
            address: '123 Main St',
            orders: []
          }), 1000)
        );
        setCustomer(response);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch customer details');
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Customer Details</h1>
      {customer && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Personal Information</h2>
              <p><span className="font-medium">Name:</span> {customer.name}</p>
              <p><span className="font-medium">Email:</span> {customer.email}</p>
              <p><span className="font-medium">Phone:</span> {customer.phone}</p>
              <p><span className="font-medium">Address:</span> {customer.address}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Order History</h2>
              {customer.orders.length > 0 ? (
                <ul className="space-y-2">
                  {customer.orders.map(order => (
                    <li key={order.id} className="border-b pb-2">
                      Order #{order.id}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No orders found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetail; 