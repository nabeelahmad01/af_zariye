'use client';
import { useState, useEffect } from 'react';
import { useToast } from '../../../context/ToastContext';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const { addToast } = useToast();

  const loadReviews = () => fetch('/api/reviews?all=true').then(r => r.json()).then(d => setReviews(d.reviews || []));
  useEffect(() => { loadReviews(); }, []);

  const toggleApproval = async (id, isApproved) => {
    const res = await fetch('/api/reviews', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isApproved: !isApproved }),
    });
    if (res.ok) { addToast(isApproved ? 'Review hidden' : 'Review approved ✅', 'success'); loadReviews(); }
  };

  const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

  return (
    <>
      <div className="admin-header">
        <h1>Reviews ({reviews.length})</h1>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead><tr><th>Customer</th><th>Rating</th><th>Comment</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {reviews.length > 0 ? reviews.map(r => (
              <tr key={r._id}>
                <td>
                  <strong>{r.name}</strong>
                  <br /><span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{r.email}</span>
                </td>
                <td style={{ color: 'var(--accent)' }}>{stars(r.rating)}</td>
                <td style={{ maxWidth: '300px' }}>
                  {r.title && <strong style={{ display: 'block', fontSize: '13px' }}>{r.title}</strong>}
                  <span style={{ fontSize: '13px', color: 'var(--text-light)' }}>{r.comment?.substring(0, 80)}{r.comment?.length > 80 ? '...' : ''}</span>
                </td>
                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                <td><span className={`status-badge ${r.isApproved ? 'status-delivered' : 'status-pending'}`}>{r.isApproved ? 'Approved' : 'Pending'}</span></td>
                <td>
                  <button onClick={() => toggleApproval(r._id, r.isApproved)}
                    style={{ color: r.isApproved ? 'var(--error)' : 'var(--success)', fontSize: '13px', fontWeight: '600' }}>
                    {r.isApproved ? 'Hide' : 'Approve'}
                  </button>
                </td>
              </tr>
            )) : <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No reviews yet</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
