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
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes?.length) {
      addToast('Please select a size', 'warning');
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
    addToast(`${product.name} added to cart! 🛍️`, 'success');
  };

  if (loading) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Loading...</p></div>;
  if (!product) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Product not found</p></div>;

  const discount = product.comparePrice > product.price ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;

  return (
    <section className="product-detail container">
      <div className="breadcrumb" style={{ marginBottom: '24px', justifyContent: 'flex-start' }}>
        <a href="/">Home</a> <span>/</span> <a href="/shop">Shop</a> <span>/</span> <span>{product.name}</span>
      </div>

      <div className="product-detail-grid">
        <div className="product-gallery">
          <div className="product-main-image">
            <img src={product.images?.[mainImage]?.url || '/placeholder.jpg'} alt={product.name} />
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
          <div className="product-prices">
            <span className="current">PKR {product.price?.toLocaleString()}</span>
            {product.comparePrice > product.price && (
              <>
                <span className="compare">PKR {product.comparePrice?.toLocaleString()}</span>
                <span className="discount">-{discount}% OFF</span>
              </>
            )}
          </div>
          <p className="product-desc">{product.description}</p>

          {product.sizes?.length > 0 && (
            <div className="size-selector">
              <label>Size: <strong>{selectedSize}</strong></label>
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
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>

          <div className="add-to-cart-row">
            <button className="btn-add-cart" onClick={handleAddToCart} disabled={product.stock <= 0}>
              {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
            </button>
            <button className="btn-wishlist">♡</button>
          </div>

          <div style={{ padding: '20px 0', borderTop: '1px solid var(--border)', fontSize: '13px', color: 'var(--text-light)' }}>
            <p>SKU: {product.sku || 'N/A'}</p>
            <p>Stock: {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</p>
            {product.tags?.length > 0 && <p>Tags: {product.tags.join(', ')}</p>}
          </div>
        </div>
      </div>

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
    </section>
  );
}
