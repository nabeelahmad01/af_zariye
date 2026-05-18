'use client';
import { useState, useEffect } from 'react';

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    fetch('/api/newsletter').then(r => r.json()).then(d => setSubscribers(d.subscribers || [])).catch(() => {});
  }, []);

  return (
    <>
      <div className="admin-header">
        <h1>Newsletter Subscribers ({subscribers.length})</h1>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr><th>#</th><th>Email</th><th>Subscribed On</th><th>Status</th></tr>
          </thead>
          <tbody>
            {subscribers.length > 0 ? subscribers.map((s, i) => (
              <tr key={s._id}>
                <td>{i + 1}</td>
                <td>{s.email}</td>
                <td>{new Date(s.subscribedAt || s.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge ${s.isActive !== false ? 'status-delivered' : 'status-cancelled'}`}>
                    {s.isActive !== false ? 'Active' : 'Unsubscribed'}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No subscribers yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
