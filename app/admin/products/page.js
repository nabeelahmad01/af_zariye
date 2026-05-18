'use client';
import { useState, useEffect } from 'react';
import { useToast } from '../../../context/ToastContext';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [collections, setCollections] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { addToast } = useToast();

  const emptyForm = { name: '', description: '', price: '', comparePrice: '', category: 'Men', sizes: ['S', 'M', 'L', 'XL'], stock: 10, featured: false, isActive: true, images: [], sku: '', collection: '', tags: '' };
  const [form, setForm] = useState(emptyForm);

  const loadData = () => {
    fetch('/api/products?limit=100').then(r => r.json()).then(d => setProducts(d.products || []));
    fetch('/api/collections').then(r => r.json()).then(d => setCollections(d.collections || []));
  };
  useEffect(loadData, []);

  const u = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    for (const file of files) {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'af-zariye/products');
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (res.ok) u('images', [...form.images, { url: data.url, publicId: data.publicId }]);
      } catch { addToast('Upload failed', 'error'); }
    }
    setUploading(false);
  };

  const removeImage = (idx) => u('images', form.images.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { ...form, price: Number(form.price), comparePrice: Number(form.comparePrice) || 0, stock: Number(form.stock), tags: typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : form.tags };
    try {
      const url = editing ? `/api/products/${editing}` : '/api/products';
      const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) {
        addToast(editing ? 'Product updated! ✅' : 'Product created! 🎉', 'success');
        setShowForm(false); setEditing(null); setForm(emptyForm); loadData();
      } else { const d = await res.json(); addToast(d.error || 'Failed', 'error'); }
    } catch { addToast('Something went wrong', 'error'); }
  };

  const handleEdit = (p) => {
    setForm({ ...p, tags: p.tags?.join(', ') || '', comparePrice: p.comparePrice || '' });
    setEditing(p._id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) { addToast('Product deleted', 'info'); loadData(); }
  };

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

  if (showForm) return (
    <>
      <div className="admin-header">
        <h1>{editing ? 'Edit Product' : 'Add Product'}</h1>
        <button className="btn-secondary" onClick={() => { setShowForm(false); setEditing(null); setForm(emptyForm); }}>← Back</button>
      </div>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-row">
          <div className="form-group"><label>Product Name *</label><input required value={form.name} onChange={e => u('name', e.target.value)} /></div>
          <div className="form-group"><label>SKU</label><input value={form.sku} onChange={e => u('sku', e.target.value)} /></div>
        </div>
        <div className="form-group"><label>Description *</label><textarea rows={4} required value={form.description} onChange={e => u('description', e.target.value)} /></div>
        <div className="form-row">
          <div className="form-group"><label>Price (PKR) *</label><input type="number" required value={form.price} onChange={e => u('price', e.target.value)} /></div>
          <div className="form-group"><label>Compare Price</label><input type="number" value={form.comparePrice} onChange={e => u('comparePrice', e.target.value)} /></div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Category *</label>
            <select value={form.category} onChange={e => u('category', e.target.value)}>
              {['Men', 'Women', 'Unisex', 'Accessories', 'Footwear'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Collection</label>
            <select value={form.collection} onChange={e => u('collection', e.target.value)}>
              <option value="">None</option>
              {collections.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Sizes</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {sizeOptions.map(s => (
              <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', padding: '6px 12px', border: '1px solid var(--border)', borderRadius: '4px', background: form.sizes?.includes(s) ? 'var(--primary)' : '', color: form.sizes?.includes(s) ? '#fff' : '' }}>
                <input type="checkbox" checked={form.sizes?.includes(s)} onChange={e => u('sizes', e.target.checked ? [...(form.sizes || []), s] : form.sizes.filter(x => x !== s))} style={{ display: 'none' }} />
                {s}
              </label>
            ))}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Stock *</label><input type="number" required value={form.stock} onChange={e => u('stock', e.target.value)} /></div>
          <div className="form-group"><label>Tags (comma separated)</label><input value={form.tags} onChange={e => u('tags', e.target.value)} placeholder="summer, trending, new" /></div>
        </div>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.featured} onChange={e => u('featured', e.target.checked)} /> Featured Product
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.isActive} onChange={e => u('isActive', e.target.checked)} /> Active
          </label>
        </div>
        <div className="form-group">
          <label>Product Images</label>
          <div className="image-upload-zone" onClick={() => document.getElementById('productImages').click()}>
            <p>{uploading ? 'Uploading...' : '📷 Click to upload images'}</p>
            <input id="productImages" type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
          </div>
          <div className="image-preview-grid">
            {form.images?.map((img, i) => (
              <div key={i} className="image-preview">
                <img src={img.url} alt="" />
                <button type="button" onClick={() => removeImage(i)}>✕</button>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="btn-primary">{editing ? 'Update Product' : 'Create Product'}</button>
      </form>
    </>
  );

  return (
    <>
      <div className="admin-header">
        <h1>Products ({products.length})</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}>+ Add Product</button>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead><tr><th>Image</th><th>Name</th><th>Price</th><th>Category</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td><div style={{ width: '50px', height: '60px', borderRadius: '4px', overflow: 'hidden', background: 'var(--bg-alt)' }}>{p.images?.[0] && <img src={p.images[0].url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}</div></td>
                <td><strong>{p.name}</strong></td>
                <td>PKR {p.price?.toLocaleString()}</td>
                <td>{p.category}</td>
                <td>{p.stock}</td>
                <td><span className={`status-badge ${p.isActive ? 'status-delivered' : 'status-cancelled'}`}>{p.isActive ? 'Active' : 'Inactive'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEdit(p)} style={{ color: 'var(--info)', fontSize: '13px', fontWeight: '600' }}>Edit</button>
                    <button onClick={() => handleDelete(p._id)} style={{ color: 'var(--error)', fontSize: '13px', fontWeight: '600' }}>Delete</button>
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
