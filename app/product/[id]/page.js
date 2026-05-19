'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCart } from '../../../context/CartContext';
import { useToast } from '../../../context/ToastContext';
import ProductCard from '../../../components/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: '', email: '', rating: 5, title: '', comment: '' });
  const [zoomStyle, setZoomStyle] = useState({});
  const [isZooming, setIsZooming] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`).then(r => r.json()).then(d => {
      setProduct(d.product);
      if (d.product?.sizes?.length) setSelectedSize(d.product.sizes[0]);
      if (d.product?.colors?.length) setSelectedColor(d.product.colors[0].name);
      if (d.product?.category) {
        fetch(`/api/products?category=${d.product.category}&limit=4`)
          .then(r => r.json()).then(rd => setRelated((rd.products || []).filter(p => p._id !== id)));
      }
    }).catch(() => {}).finally(() => setLoading(false));

    // Load reviews
    fetch(`/api/reviews?product=${id}`).then(r => r.json()).then(d => {
      setReviews(d.reviews || []);
      setAvgRating(d.avgRating || 0);
    }).catch(() => {});
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes?.length) {
      addToast('Please select a size', 'warning');
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
    addToast(`${product.name} added to cart! 🛍️`, 'success');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...reviewForm, product: id }),
      });
      const data = await res.json();
      if (res.ok) {
        addToast(data.message || 'Review submitted!', 'success');
        setShowReviewForm(false);
        setReviewForm({ name: '', email: '', rating: 5, title: '', comment: '' });
      } else addToast(data.error, 'error');
    } catch { addToast('Failed to submit', 'error'); }
  };

  const handleImageZoom = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: 'scale(2)' });
    setIsZooming(true);
  };

  const whatsappMsg = product ? `Hi! I'm interested in ${product.name} (PKR ${product.price?.toLocaleString()}) - ${typeof window !== 'undefined' ? window.location.href : ''}` : '';
  const whatsappLink = `https://wa.me/923000000000?text=${encodeURIComponent(whatsappMsg)}`;

  if (loading) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Loading...</p></div>;
  if (!product) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Product not found</p></div>;

  const discount = product.comparePrice > product.price ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;
  const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

  return (
    <section className="product-detail container">
      <div className="breadcrumb" style={{ marginBottom: '24px', justifyContent: 'flex-start' }}>
        <a href="/">Home</a> <span>/</span> <a href="/shop">Shop</a> <span>/</span> <span>{product.name}</span>
      </div>

      <div className="product-detail-grid">
        <div className="product-gallery">
          <div className="product-main-image" style={{ overflow: 'hidden', cursor: 'zoom-in' }}
            onMouseMove={handleImageZoom}
            onMouseLeave={() => { setIsZooming(false); setZoomStyle({}); }}>
            <img src={product.images?.[mainImage]?.url || '/placeholder.jpg'} alt={product.name}
              style={isZooming ? zoomStyle : { transition: 'transform 0.3s ease' }} />
          </div>
          {product.images?.length > 1 && (
            <div className="product-thumbs">
              {product.images.map((img, i) => (
                <div key={i} className={`product-thumb ${mainImage === i ? 'active' : ''}`} onClick={() => setMainImage(i)}>
                  <img src={img.url} alt={`${product.name} ${i + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <p className="product-category">{product.category}</p>
          <h1>{product.name}</h1>

          {/* Rating */}
          {reviews.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ color: 'var(--accent)', fontSize: '16px' }}>{stars(Math.round(avgRating))}</span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{avgRating} ({reviews.length} reviews)</span>
            </div>
          )}

          <div className="product-prices">
            {product.comparePrice > product.price && (
              <>
                <span className="compare">PKR {product.comparePrice?.toLocaleString()}</span>
              </>
            )}
            <span className={`current ${product.comparePrice > product.price ? 'sale-price' : ''}`}>
              PKR {product.price?.toLocaleString()}
            </span>
            {product.comparePrice > product.price && (
              <span className="discount">-{discount}% OFF</span>
            )}
          </div>
          <p className="product-desc">{product.description}</p>

          {product.sizes?.length > 0 && (
            <div className="size-selector">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label>Size: <strong>{selectedSize}</strong></label>
                <button onClick={() => setShowSizeGuide(true)} style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Size Guide</button>
              </div>
              <div className="size-options">
                {product.sizes.map(size => (
                  <button key={size} className={`size-btn ${selectedSize === size ? 'active' : ''}`} onClick={() => setSelectedSize(size)}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors?.length > 0 && (
            <div className="color-selector">
              <label>Color: <strong>{selectedColor}</strong></label>
              <div className="color-options">
                {product.colors.map(color => (
                  <div key={color.name} className={`color-btn ${selectedColor === color.name ? 'active' : ''}`}
                    style={{ background: color.hex }} onClick={() => setSelectedColor(color.name)} title={color.name} />
                ))}
              </div>
            </div>
          )}

          <div className="qty-selector">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
          </div>

          <div className="add-to-cart-row">
            <button className="btn-add-cart" onClick={handleAddToCart} disabled={product.stock <= 0}>
              {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
            </button>
            <button className="btn-wishlist">♡</button>
          </div>

          {/* WhatsApp Order Button */}
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '14px', background: '#25d366', color: '#fff', fontSize: '13px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', borderRadius: 'var(--radius)', transition: 'all 0.3s ease', marginBottom: '20px' }}>
            💬 Order via WhatsApp
          </a>

          <div style={{ padding: '20px 0', borderTop: '1px solid var(--border)', fontSize: '13px', color: 'var(--text-light)' }}>
            <p>SKU: {product.sku || 'N/A'}</p>
            <p>Stock: {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</p>
            {product.tags?.length > 0 && <p>Tags: {product.tags.join(', ')}</p>}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{ marginTop: '100px', padding: '0 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px', textAlign: 'center' }}>
            <p className="section-subtitle">Customer Feedback</p>
            <h2 className="section-title" style={{ marginBottom: '16px' }}>Reviews ({reviews.length})</h2>
            
            {reviews.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ fontSize: '32px', fontWeight: '700' }}>{Number(avgRating).toFixed(1)}</div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div style={{ color: 'var(--accent)', fontSize: '18px', letterSpacing: '2px' }}>{stars(Math.round(avgRating))}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Based on {reviews.length} reviews</div>
                </div>
              </div>
            )}
            
            <button className="btn-primary" onClick={() => setShowReviewForm(!showReviewForm)} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              {showReviewForm ? 'Cancel Review' : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                  Write a Review
                </>
              )}
            </button>
          </div>

          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} style={{ margin: '0 auto 60px', padding: '40px', background: 'var(--bg-alt)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>Submit Your Review</h3>
              <div className="form-row">
                <div className="form-group"><label>Name *</label><input required value={reviewForm.name} onChange={e => setReviewForm(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" /></div>
                <div className="form-group"><label>Email *</label><input type="email" required value={reviewForm.email} onChange={e => setReviewForm(p => ({ ...p, email: e.target.value }))} placeholder="john@example.com" /></div>
              </div>
              <div className="form-group" style={{ margin: '20px 0' }}>
                <label>Overall Rating *</label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} type="button" onClick={() => setReviewForm(p => ({ ...p, rating: n }))}
                      style={{ fontSize: '32px', color: n <= reviewForm.rating ? 'var(--accent)' : 'var(--border)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s', padding: '0' }}>★</button>
                  ))}
                </div>
              </div>
              <div className="form-group"><label>Review Title (Optional)</label><input value={reviewForm.title} onChange={e => setReviewForm(p => ({ ...p, title: e.target.value }))} placeholder="Sum up your experience" /></div>
              <div className="form-group"><label>Review Details *</label><textarea rows={5} required value={reviewForm.comment} onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))} placeholder="What did you like or dislike about this product?" style={{ resize: 'vertical' }} /></div>
              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>Submit Review</button>
            </form>
          )}

          {reviews.length > 0 ? (
            <div style={{ display: 'grid', gap: '20px' }}>
              {reviews.map(r => (
                <div key={r._id} style={{ padding: '30px', background: 'var(--bg-alt)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '600', color: 'var(--text-muted)' }}>
                        {r.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <strong style={{ fontSize: '15px', display: 'block', marginBottom: '4px' }}>{r.name}</strong>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: 'var(--accent)', fontSize: '14px', letterSpacing: '1px' }}>{stars(r.rating)}</span>
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(r.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div style={{ paddingLeft: '64px' }}>
                    {r.title && <h4 style={{ fontWeight: '600', marginBottom: '8px', fontSize: '16px' }}>{r.title}</h4>}
                    <p style={{ fontSize: '15px', color: 'var(--text-light)', lineHeight: '1.7' }}>{r.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-alt)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px', opacity: 0.5 }}>⭐</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No reviews yet</h3>
              <p style={{ color: 'var(--text-muted)' }}>Be the first to share your thoughts about this product.</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div style={{ marginTop: '80px' }}>
          <div className="section-header">
            <p className="section-subtitle">You May Also Like</p>
            <h2 className="section-title">Related Products</h2>
          </div>
          <div className="products-grid">
            {related.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowSizeGuide(false)}>
          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: '30px', maxWidth: '500px', width: '100%', maxHeight: '80vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3>Size Guide</h3>
              <button onClick={() => setShowSizeGuide(false)} style={{ fontSize: '20px' }}>✕</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead><tr style={{ borderBottom: '2px solid var(--primary)' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Size</th>
                <th style={{ padding: '10px' }}>Chest (in)</th>
                <th style={{ padding: '10px' }}>Waist (in)</th>
                <th style={{ padding: '10px' }}>Length (in)</th>
              </tr></thead>
              <tbody>
                {[['XS', '34', '28', '26'], ['S', '36', '30', '27'], ['M', '38', '32', '28'], ['L', '40', '34', '29'], ['XL', '42', '36', '30'], ['XXL', '44', '38', '31']].map(([s, c, w, l]) => (
                  <tr key={s} style={{ borderBottom: '1px solid var(--border-light)', background: selectedSize === s ? 'var(--bg-alt)' : '' }}>
                    <td style={{ padding: '10px', fontWeight: '600' }}>{s}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{c}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{w}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{l}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '16px' }}>Measurements are approximate. When in doubt, size up.</p>
          </div>
        </div>
      )}
    </section>
  );
}
