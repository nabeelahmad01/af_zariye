'use client';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, collections: 0, subscribers: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/products?limit=1').then(r => r.json()),
      fetch('/api/orders?limit=5').then(r => r.json()),
      fetch('/api/collections').then(r => r.json()),
      fetch('/api/newsletter').then(r => r.json()),
    ]).then(([p, o, c, n]) => {
      setStats({
        products: p.total || 0,
        orders: o.total || 0,
        collections: c.collections?.length || 0,
        subscribers: n.total || 0,
      });
      setRecentOrders(o.orders || []);
    }).catch(() => {});
  }, []);

  const statusLabels = {
    pending: 'Pending', confirmed: 'Confirmed', processing: 'Processing',
    shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled',
  };

  return (
    <>
      <div className="admin-header">
        <h1>Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Welcome back, Admin!</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Total Products</p>
          <p className="stat-value">{stats.products}</p>
          <p className="stat-change up">📦 Active items</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total Orders</p>
          <p className="stat-value">{stats.orders}</p>
          <p className="stat-change up">🛒 All time</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Collections</p>
          <p className="stat-value">{stats.collections}</p>
          <p className="stat-change">🏷️ Active</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Subscribers</p>
          <p className="stat-value">{stats.subscribers}</p>
          <p className="stat-change up">📧 Newsletter</p>
        </div>
      </div>

      <div className="admin-table-container">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Recent Orders</h3>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.length > 0 ? recentOrders.map(order => (
              <tr key={order._id}>
                <td><strong>{order.orderId}</strong></td>
                <td>{order.customerInfo?.name}</td>
                <td>PKR {order.total?.toLocaleString()}</td>
                <td><span className={`status-badge status-${order.status}`}>{statusLabels[order.status]}</span></td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No orders yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
