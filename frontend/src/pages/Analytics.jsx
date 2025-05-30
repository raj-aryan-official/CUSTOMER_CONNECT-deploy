import React from 'react';

const Analytics = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Sales Overview Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Sales Overview</h2>
          <div className="space-y-2">
            <p className="text-gray-600">Total Sales</p>
            <p className="text-2xl font-bold">$24,500</p>
            <p className="text-green-500">↑ 12% from last month</p>
          </div>
        </div>

        {/* Customer Growth Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Customer Growth</h2>
          <div className="space-y-2">
            <p className="text-gray-600">New Customers</p>
            <p className="text-2xl font-bold">156</p>
            <p className="text-green-500">↑ 8% from last month</p>
          </div>
        </div>

        {/* Order Statistics Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Order Statistics</h2>
          <div className="space-y-2">
            <p className="text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold">1,234</p>
            <p className="text-green-500">↑ 15% from last month</p>
          </div>
        </div>
      </div>

      {/* Placeholder for Charts */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Sales Trend</h2>
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
          <p className="text-gray-500">Chart will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 