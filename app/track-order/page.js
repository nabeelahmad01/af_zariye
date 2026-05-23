'use client';
import { useState } from 'react';
import { useToast } from '../../context/ToastContext';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setLoading(true);
    setOrder(null);
    try {
      const res = await fetch(`/api/orders/track?orderId=${orderId.trim()}`);
      const data = await res.json();
      if (res.ok) {
        setOrder(data);
      } else {
        addToast(data.error || 'Order not found', 'error');
      }
    } catch {
      addToast('Failed to track order', 'error');
    }
    setLoading(false);
  };

  const statusLabels = { pending: '⏳ Pending', confirmed: '✅ Confirmed', processing: '⚙️ Processing', shipped: '📦 Shipped', in_transit: '🚚 In Transit', delivered: '✨ Delivered', cancelled: '❌ Cancelled' };

  return (
    <>
      <div className="page-banner">
        <div className="page-banner-content">
          <h1>Track Your Order</h1>
          <p>Enter your order ID to track your package</p>
        </div>
      </div>
      <section className="track-page container">
        <form onSubmit={handleTrack} className="track-form">
          <input type="text" value={orderId} onChange={e => setOrderId(e.target.value)} placeholder="Enter Order ID (e.g., AFZ-2024-1234)" className="form-group" style={{ padding: '14px 20px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '14px',marginBottom:0 }} required />
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Tracking...' : 'Track'}</button>
        </form>

        {order && (
          <div className="track-result">
            <div style={{ background: 'var(--bg-alt)', padding: '24px', borderRadius: 'var(--radius-lg)', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Order ID</p>
                  <p style={{ fontSize: '18px', fontWeight: '700' }}>{order.orderId}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</p>
                  <span className={`status-badge status-${order.status}`}>{statusLabels[order.status] || order.status}</span>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total</p>
                  <p style={{ fontSize: '18px', fontWeight: '700' }}>PKR {order.total?.toLocaleString()}</p>
                </div>
                {order.trackingId && (
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Tracking ID</p>
                    <p style={{ fontSize: '16px', fontWeight: '600' }}>{order.trackingId}</p>
                  </div>
                )}
              </div>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>Tracking Timeline</h3>
            <div className="tracking-timeline">
              {order.trackingHistory?.map((step, i) => (
                <div key={i} className={`timeline-step ${i === 0 ? 'active' : 'completed'}`}>
                  <h4>{statusLabels[step.status] || step.status}</h4>
                  <p>{step.message}</p>
                  <p style={{ fontSize: '11px', marginTop: '4px' }}>{new Date(step.timestamp).toLocaleString()}</p>
                </div>
              )).reverse()}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
