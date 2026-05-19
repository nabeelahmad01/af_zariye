'use client';
import { useState, useEffect } from 'react';
import { useToast } from '../../../context/ToastContext';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const { addToast } = useToast();
  const [form, setForm] = useState({ code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', maxUses: '', expiresAt: '', isActive: true });
  const u = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const loadCoupons = () => fetch('/api/coupons').then(r => r.json()).then(d => setCoupons(d.coupons || []));
  useEffect(() => { loadCoupons(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { ...form, discountValue: Number(form.discountValue), minOrderAmount: Number(form.minOrderAmount) || 0, maxUses: Number(form.maxUses) || 0, expiresAt: form.expiresAt || undefined };
    const res = await fetch('/api/coupons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) {
      addToast('Coupon created! 🎉', 'success');
      setShowForm(false);
      setForm({ code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', maxUses: '', expiresAt: '', isActive: true });
      loadCoupons();
    } else { const d = await res.json(); addToast(d.error || 'Failed', 'error'); }
  };

  if (showForm) return (
    <>
      <div className="admin-header">
        <h1>Create Coupon</h1>
        <button className="btn-secondary" onClick={() => setShowForm(false)}>← Back</button>
      </div>
      <form onSubmit={handleSubmit} className="admin-form" style={{ maxWidth: '600px' }}>
        <div className="form-row">
          <div className="form-group"><label>Coupon Code *</label><input required value={form.code} onChange={e => u('code', e.target.value.toUpperCase())} placeholder="ZARIYE10" style={{ textTransform: 'uppercase' }} /></div>
          <div className="form-group">
            <label>Discount Type</label>
            <select value={form.discountType} onChange={e => u('discountType', e.target.value)}>
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (PKR)</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Discount Value *</label><input type="number" required value={form.discountValue} onChange={e => u('discountValue', e.target.value)} placeholder={form.discountType === 'percentage' ? '10' : '500'} /></div>
          <div className="form-group"><label>Min Order Amount</label><input type="number" value={form.minOrderAmount} onChange={e => u('minOrderAmount', e.target.value)} placeholder="0 = no minimum" /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Max Uses</label><input type="number" value={form.maxUses} onChange={e => u('maxUses', e.target.value)} placeholder="0 = unlimited" /></div>
          <div className="form-group"><label>Expires At</label><input type="date" value={form.expiresAt} onChange={e => u('expiresAt', e.target.value)} /></div>
        </div>
        <button type="submit" className="btn-primary">Create Coupon</button>
      </form>
    </>
  );

  return (
    <>
      <div className="admin-header">
        <h1>Coupons ({coupons.length})</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}>+ Create Coupon</button>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead><tr><th>Code</th><th>Type</th><th>Value</th><th>Min Order</th><th>Uses</th><th>Expires</th><th>Status</th></tr></thead>
          <tbody>
            {coupons.length > 0 ? coupons.map(c => (
              <tr key={c._id}>
                <td><strong>{c.code}</strong></td>
                <td style={{ textTransform: 'capitalize' }}>{c.discountType}</td>
                <td>{c.discountType === 'percentage' ? `${c.discountValue}%` : `PKR ${c.discountValue}`}</td>
                <td>{c.minOrderAmount ? `PKR ${c.minOrderAmount.toLocaleString()}` : 'None'}</td>
                <td>{c.usedCount}/{c.maxUses || '∞'}</td>
                <td>{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : 'Never'}</td>
                <td><span className={`status-badge ${c.isActive ? 'status-delivered' : 'status-cancelled'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
              </tr>
            )) : <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No coupons yet</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
