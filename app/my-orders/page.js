'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function MyOrdersPage() {
  const { data: session } = useSession();
  const [email, setEmail] = useState(session?.user?.email || '');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const statusLabels = { pending: 'Pending', confirmed: 'Confirmed', processing: 'Processing', shipped: 'Shipped', in_transit: 'In Transit', delivered: 'Delivered', cancelled: 'Cancelled' };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/my-orders?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {}
    setLoading(false);
    setSearched(true);
  };

  return (
    <>
      <div className="page-banner">
        <div className="page-banner-content">
          <h1>My Orders</h1>
          <p>View your order history and track shipments</p>
        </div>
      </div>
      <section className="track-page container">
        <form onSubmit={handleSearch} style={{ maxWidth: '500px', margin: '0 auto 40px', display: 'flex', gap: '10px' }}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email address" required
            style={{ flex: 1, padding: '12px 16px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '14px' }} />
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Searching...' : 'Find Orders'}</button>
        </form>

        {searched && orders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>📦</p>
            <p>No orders found for this email.</p>
            <Link href="/shop" className="btn-secondary" style={{ marginTop: '16px', display: 'inline-block' }}>Start Shopping</Link>
          </div>
        )}

        {orders.length > 0 && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {orders.map(o => (
              <div key={o._id} style={{ background: '#fff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <strong style={{ fontSize: '16px' }}>{o.orderId}</strong>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: '12px' }}>{new Date(o.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className={`status-badge status-${o.status}`}>{statusLabels[o.status]}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  {o.items?.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{ width: '50px', height: '60px', borderRadius: '4px', overflow: 'hidden', background: 'var(--bg-alt)' }}>
                        <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: '500' }}>{item.name}</p>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.size} × {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                  <span style={{ fontWeight: '700' }}>PKR {o.total?.toLocaleString()}</span>
                  <Link href={`/track-order?id=${o.orderId}`} style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: '600' }}>Track Order →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
