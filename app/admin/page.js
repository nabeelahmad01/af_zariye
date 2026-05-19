'use client';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, collections: 0, subscribers: 0, revenue: 0, pendingOrders: 0, reviews: 0, coupons: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/products?limit=1').then(r => r.json()),
      fetch('/api/orders?limit=5').then(r => r.json()),
      fetch('/api/collections').then(r => r.json()),
      fetch('/api/newsletter').then(r => r.json()),
      fetch('/api/reviews?all=true').then(r => r.json()),
      fetch('/api/coupons').then(r => r.json()),
    ]).then(([prods, orders, cols, subs, reviews, coupons]) => {
      const allOrders = orders.orders || [];
      const revenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      const pending = allOrders.filter(o => o.status === 'pending').length;
      setStats({
        products: prods.total || 0,
        orders: orders.total || 0,
        collections: cols.collections?.length || 0,
        subscribers: subs.subscribers?.length || 0,
        revenue,
        pendingOrders: pending,
        reviews: reviews.total || 0,
        coupons: coupons.coupons?.length || 0,
      });
      setRecentOrders(allOrders.slice(0, 5));
    }).catch(() => {});
  }, []);

  const statusLabels = { pending: 'Pending', confirmed: 'Confirmed', processing: 'Processing', shipped: 'Shipped', in_transit: 'In Transit', delivered: 'Delivered', cancelled: 'Cancelled' };

  return (
    <>
      <div className="admin-header">
        <h1>Dashboard</h1>
        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Welcome back, Admin 👋</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">PKR {stats.revenue.toLocaleString()}</div>
          <div className="stat-change up">From {stats.orders} orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Orders</div>
          <div className="stat-value">{stats.orders}</div>
          <div className="stat-change" style={{ color: stats.pendingOrders > 0 ? 'var(--warning)' : 'var(--success)' }}>{stats.pendingOrders} pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Products</div>
          <div className="stat-value">{stats.products}</div>
          <div className="stat-change up">In catalog</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Collections</div>
          <div className="stat-value">{stats.collections}</div>
          <div className="stat-change up">Active</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Subscribers</div>
          <div className="stat-value">{stats.subscribers}</div>
          <div className="stat-change up">Newsletter</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Reviews</div>
          <div className="stat-value">{stats.reviews}</div>
          <div className="stat-change up">Customer feedback</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Coupons</div>
          <div className="stat-value">{stats.coupons}</div>
          <div className="stat-change up">Active codes</div>
        </div>
      </div>

      <div className="admin-table-container">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Recent Orders</h3>
          <a href="/admin/orders" style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: '600' }}>View All →</a>
        </div>
        <table className="admin-table">
          <thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {recentOrders.length > 0 ? recentOrders.map(o => (
              <tr key={o._id}>
                <td><strong>{o.orderId}</strong></td>
                <td>{o.customerInfo?.name}</td>
                <td>PKR {o.total?.toLocaleString()}</td>
                <td><span className={`status-badge status-${o.status}`}>{statusLabels[o.status]}</span></td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            )) : (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No orders yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
