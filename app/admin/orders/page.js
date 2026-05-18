'use client';
import { useState, useEffect } from 'react';
import { useToast } from '../../../context/ToastContext';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [updateData, setUpdateData] = useState({ status: '', trackingId: '', trackingMessage: '' });
  const { addToast } = useToast();

  const loadOrders = () => {
    const params = new URLSearchParams({ limit: 100 });
    if (filter) params.set('status', filter);
    fetch(`/api/orders?${params}`).then(r => r.json()).then(d => setOrders(d.orders || []));
  };
  useEffect(loadOrders, [filter]);

  const handleUpdate = async () => {
    if (!selected || !updateData.status) return;
    try {
      const res = await fetch(`/api/orders/${selected._id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (res.ok) { addToast('Order updated! ✅', 'success'); setSelected(null); loadOrders(); }
    } catch { addToast('Update failed', 'error'); }
  };

  const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'in_transit', 'delivered', 'cancelled'];
  const statusLabels = { pending: 'Pending', confirmed: 'Confirmed', processing: 'Processing', shipped: 'Shipped', in_transit: 'In Transit', delivered: 'Delivered', cancelled: 'Cancelled' };

  if (selected) return (
    <>
      <div className="admin-header">
        <h1>Order {selected.orderId}</h1>
        <button className="btn-secondary" onClick={() => setSelected(null)}>← Back</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="admin-form">
          <h3 style={{ marginBottom: '16px' }}>Order Details</h3>
          <p><strong>Customer:</strong> {selected.customerInfo?.name}</p>
          <p><strong>Email:</strong> {selected.customerInfo?.email}</p>
          <p><strong>Phone:</strong> {selected.customerInfo?.phone}</p>
          <p><strong>Address:</strong> {[selected.customerInfo?.address?.street, selected.customerInfo?.address?.city, selected.customerInfo?.address?.state].filter(Boolean).join(', ')}</p>
          <p><strong>Payment:</strong> {selected.paymentMethod?.toUpperCase()}</p>
          <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid var(--border)' }} />
          <h4 style={{ marginBottom: '12px' }}>Items</h4>
          {selected.items?.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '50px', borderRadius: '4px', overflow: 'hidden' }}><img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
              <div style={{ flex: 1 }}><p style={{ fontSize: '14px', fontWeight: '500' }}>{item.name}</p><p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.size} × {item.quantity}</p></div>
              <p style={{ fontWeight: '600' }}>PKR {(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
          <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid var(--border)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>PKR {selected.subtotal?.toLocaleString()}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Shipping</span><span>PKR {selected.shippingCost?.toLocaleString()}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '18px', marginTop: '8px' }}><span>Total</span><span>PKR {selected.total?.toLocaleString()}</span></div>
        </div>
        <div className="admin-form">
          <h3 style={{ marginBottom: '16px' }}>Update Order</h3>
          <div className="form-group">
            <label>Status</label>
            <select value={updateData.status} onChange={e => setUpdateData(p => ({ ...p, status: e.target.value }))}>
              <option value="">Select status</option>
              {statuses.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Tracking ID</label><input value={updateData.trackingId} onChange={e => setUpdateData(p => ({ ...p, trackingId: e.target.value }))} placeholder="Courier tracking number" /></div>
          <div className="form-group"><label>Status Message</label><input value={updateData.trackingMessage} onChange={e => setUpdateData(p => ({ ...p, trackingMessage: e.target.value }))} placeholder="e.g. Package shipped via TCS" /></div>
          <button className="btn-primary" onClick={handleUpdate}>Update Order</button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className="admin-header">
        <h1>Orders ({orders.length})</h1>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
          <option value="">All Orders</option>
          {statuses.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
        </select>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id}>
                <td><strong>{o.orderId}</strong></td>
                <td>{o.customerInfo?.name}</td>
                <td>{o.items?.length} items</td>
                <td>PKR {o.total?.toLocaleString()}</td>
                <td style={{ textTransform: 'uppercase', fontSize: '12px' }}>{o.paymentMethod}</td>
                <td><span className={`status-badge status-${o.status}`}>{statusLabels[o.status]}</span></td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td><button onClick={() => { setSelected(o); setUpdateData({ status: o.status, trackingId: o.trackingId || '', trackingMessage: '' }); }} style={{ color: 'var(--info)', fontSize: '13px', fontWeight: '600' }}>Manage</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
