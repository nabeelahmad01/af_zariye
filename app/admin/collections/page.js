'use client';
import { useState, useEffect } from 'react';
import { useToast } from '../../../context/ToastContext';

export default function AdminCollections() {
  const [collections, setCollections] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { addToast } = useToast();

  const emptyForm = { name: '', description: '', featured: false, isActive: true, banner: { url: '', publicId: '' }, thumbnail: { url: '', publicId: '' } };
  const [form, setForm] = useState(emptyForm);

  const loadData = () => { fetch('/api/collections').then(r => r.json()).then(d => setCollections(d.collections || [])); };
  useEffect(loadData, []);

  const u = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleImageUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', 'af-zariye/collections');
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) u(field, { url: data.url, publicId: data.publicId });
    } catch { addToast('Upload failed', 'error'); }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editing ? `/api/collections/${editing}` : '/api/collections';
      const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) {
        addToast(editing ? 'Collection updated! ✅' : 'Collection created! 🎉', 'success');
        setShowForm(false); setEditing(null); setForm(emptyForm); loadData();
      } else { const d = await res.json(); addToast(d.error || 'Failed', 'error'); }
    } catch { addToast('Something went wrong', 'error'); }
  };

  const handleEdit = (c) => { setForm(c); setEditing(c.slug); setShowForm(true); };
  const handleDelete = async (slug) => {
    if (!confirm('Delete this collection?')) return;
    const res = await fetch(`/api/collections/${slug}`, { method: 'DELETE' });
    if (res.ok) { addToast('Collection deleted', 'info'); loadData(); }
  };

  if (showForm) return (
    <>
      <div className="admin-header">
        <h1>{editing ? 'Edit Collection' : 'Add Collection'}</h1>
        <button className="btn-secondary" onClick={() => { setShowForm(false); setEditing(null); setForm(emptyForm); }}>← Back</button>
      </div>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group"><label>Collection Name *</label><input required value={form.name} onChange={e => u('name', e.target.value)} /></div>
        <div className="form-group"><label>Description</label><textarea rows={3} value={form.description} onChange={e => u('description', e.target.value)} /></div>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.featured} onChange={e => u('featured', e.target.checked)} /> Featured
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.isActive} onChange={e => u('isActive', e.target.checked)} /> Active
          </label>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Banner Image</label>
            <div className="image-upload-zone" onClick={() => document.getElementById('bannerImg').click()}>
              {form.banner?.url ? <img src={form.banner.url} alt="" style={{ maxHeight: '150px', margin: '0 auto' }} /> : <p>{uploading ? 'Uploading...' : '📷 Upload Banner'}</p>}
              <input id="bannerImg" type="file" accept="image/*" onChange={e => handleImageUpload(e, 'banner')} style={{ display: 'none' }} />
            </div>
          </div>
          <div className="form-group">
            <label>Thumbnail Image</label>
            <div className="image-upload-zone" onClick={() => document.getElementById('thumbImg').click()}>
              {form.thumbnail?.url ? <img src={form.thumbnail.url} alt="" style={{ maxHeight: '150px', margin: '0 auto' }} /> : <p>{uploading ? 'Uploading...' : '📷 Upload Thumbnail'}</p>}
              <input id="thumbImg" type="file" accept="image/*" onChange={e => handleImageUpload(e, 'thumbnail')} style={{ display: 'none' }} />
            </div>
          </div>
        </div>
        <button type="submit" className="btn-primary">{editing ? 'Update Collection' : 'Create Collection'}</button>
      </form>
    </>
  );

  return (
    <>
      <div className="admin-header">
        <h1>Collections ({collections.length})</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}>+ Add Collection</button>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead><tr><th>Image</th><th>Name</th><th>Slug</th><th>Featured</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {collections.map(c => (
              <tr key={c._id}>
                <td><div style={{ width: '60px', height: '40px', borderRadius: '4px', overflow: 'hidden', background: 'var(--bg-alt)' }}>{(c.banner?.url || c.thumbnail?.url) && <img src={c.banner?.url || c.thumbnail?.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}</div></td>
                <td><strong>{c.name}</strong></td>
                <td style={{ color: 'var(--text-muted)' }}>{c.slug}</td>
                <td>{c.featured ? '⭐' : '—'}</td>
                <td><span className={`status-badge ${c.isActive ? 'status-delivered' : 'status-cancelled'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEdit(c)} style={{ color: 'var(--info)', fontSize: '13px', fontWeight: '600' }}>Edit</button>
                    <button onClick={() => handleDelete(c.slug)} style={{ color: 'var(--error)', fontSize: '13px', fontWeight: '600' }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
