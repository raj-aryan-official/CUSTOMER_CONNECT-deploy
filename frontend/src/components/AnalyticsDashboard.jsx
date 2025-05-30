import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { PDFDocument, rgb } from 'pdf-lib';

const AnalyticsDashboard = () => {
  const { user } = useAuth();
  const [salesData, setSalesData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [detailedSales, setDetailedSales] = useState(null);
  const [detailedInventory, setDetailedInventory] = useState(null);
  const [detailedCustomers, setDetailedCustomers] = useState(null);
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [
        salesRes,
        inventoryRes,
        customerRes,
        detailedSalesRes,
        detailedInventoryRes,
        detailedCustomersRes
      ] = await Promise.all([
        axios.get(`/api/analytics/sales?range=${timeRange}`),
        axios.get('/api/analytics/inventory'),
        axios.get('/api/analytics/customers'),
        axios.get(`/api/analytics/sales/detailed?range=${timeRange}`),
        axios.get('/api/analytics/inventory/detailed'),
        axios.get('/api/analytics/customers/detailed')
      ]);

      setSalesData(salesRes.data);
      setInventoryData(inventoryRes.data);
      setCustomerData(customerRes.data);
      setDetailedSales(detailedSalesRes.data);
      setDetailedInventory(detailedInventoryRes.data);
      setDetailedCustomers(detailedCustomersRes.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = (data, filename) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  const exportToCSV = (data, filename) => {
    const csv = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(data));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `${filename}.csv`);
  };

  const exportToPDF = async (data, filename) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    // Add title
    page.drawText(filename, {
      x: 50,
      y: height - 50,
      size: 20,
      color: rgb(0, 0, 0)
    });

    // Add data
    let y = height - 100;
    data.forEach((item, index) => {
      const text = Object.entries(item)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      page.drawText(text, {
        x: 50,
        y,
        size: 12,
        color: rgb(0, 0, 0)
      });
      y -= 20;
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, `${filename}.pdf`);
  };

  const exportData = (data, filename, format) => {
    switch (format) {
      case 'excel':
        exportToExcel(data, filename);
        break;
      case 'csv':
        exportToCSV(data, filename);
        break;
      case 'pdf':
        exportToPDF(data, filename);
        break;
      default:
        exportToExcel(data, filename);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-4 py-2 rounded ${timeRange === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-4 py-2 rounded ${timeRange === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-4 py-2 rounded ${timeRange === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Year
            </button>
          </div>
          <div className="flex gap-4">
            <select
              onChange={(e) => exportData(salesData, 'sales_report', e.target.value)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <option value="">Export Sales</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
              <option value="pdf">PDF</option>
            </select>
            <select
              onChange={(e) => exportData(inventoryData.lowStock, 'inventory_report', e.target.value)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <option value="">Export Inventory</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
              <option value="pdf">PDF</option>
            </select>
            <select
              onChange={(e) => exportData(customerData.loyalty, 'customer_report', e.target.value)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <option value="">Export Customers</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-4 border-b">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 ${activeTab === 'overview' ? 'border-b-2 border-blue-500' : ''}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-4 py-2 ${activeTab === 'sales' ? 'border-b-2 border-blue-500' : ''}`}
          >
            Sales Details
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 ${activeTab === 'inventory' ? 'border-b-2 border-blue-500' : ''}`}
          >
            Inventory Details
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2 ${activeTab === 'customers' ? 'border-b-2 border-blue-500' : ''}`}
          >
            Customer Details
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sales Overview */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Sales Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                <Line type="monotone" dataKey="orders" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Inventory Overview */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Inventory Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'In Stock', value: inventoryData.inStock },
                    { name: 'Low Stock', value: inventoryData.lowStock.length },
                    { name: 'Out of Stock', value: inventoryData.outOfStock }
                  ]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Customer Overview */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Customer Loyalty</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={customerData.loyalty}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tier" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="customers" fill="#8884d8" />
                <Bar dataKey="revenue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'sales' && detailedSales && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Hourly Sales</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={detailedSales.hourlySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id.hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Category Sales</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={detailedSales.categorySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" />
                <Bar dataKey="quantity" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && detailedInventory && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Stock Movement</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={detailedInventory.stockMovement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id.product" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalQuantity" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Supplier Performance</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Supplier</th>
                    <th className="px-4 py-2">Products</th>
                    <th className="px-4 py-2">Total Stock</th>
                    <th className="px-4 py-2">Low Stock Items</th>
                  </tr>
                </thead>
                <tbody>
                  {detailedInventory.supplierPerformance.map((item) => (
                    <tr key={item._id}>
                      <td className="px-4 py-2">{item._id}</td>
                      <td className="px-4 py-2">{item.products}</td>
                      <td className="px-4 py-2">{item.totalStock}</td>
                      <td className="px-4 py-2">{item.lowStockItems}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'customers' && detailedCustomers && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Customer Lifetime Value</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={detailedCustomers.customerLTV}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="customerId" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalSpent" fill="#8884d8" />
                <Bar dataKey="averageOrderValue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Customer Retention</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={detailedCustomers.retention}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="uniqueCustomers" stroke="#8884d8" />
                <Line type="monotone" dataKey="totalOrders" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard; 