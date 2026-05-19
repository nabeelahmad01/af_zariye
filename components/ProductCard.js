'use client';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const discount = product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const size = product.sizes?.[0] || 'Free Size';
    addToCart(product, size, '', 1);
    addToast(`${product.name} added to cart!`, 'success');
  };

  return (
    <div className="product-card">
      <Link href={`/product/${product._id}`} className="product-card-link">
        <div className="product-card-image">
          <img src={product.images?.[0]?.url || '/placeholder.jpg'} alt={product.name} loading="lazy" />
          {product.images?.[1] && (
            <img src={product.images[1].url} alt={product.name} className="product-card-hover-img" loading="lazy" />
          )}
          {discount > 0 ? (
            <span className="product-badge sale">-{discount}%</span>
          ) : product.featured ? (
            <span className="product-badge new">NEW</span>
          ) : null}
          {product.stock <= 0 && <div className="product-sold-out">Sold Out</div>}
          <button className="quick-add-btn" onClick={handleQuickAdd} disabled={product.stock <= 0}>
            {product.stock > 0 ? 'Quick Add' : 'Sold Out'}
          </button>
        </div>
        <div className="product-card-info">
          <p className="product-card-category">{product.category}</p>
          <h3 className="product-card-name">{product.name}</h3>
          <div className="product-card-prices">
            {product.comparePrice > product.price && (
              <span className="product-card-compare">PKR {product.comparePrice?.toLocaleString()}</span>
            )}
            <span className={`product-card-price ${product.comparePrice > product.price ? 'sale-price' : ''}`}>
              PKR {product.price?.toLocaleString()}
            </span>
          </div>
          {product.colors?.length > 0 && (
            <div className="product-card-colors">
              {product.colors.map((c, i) => (
                <span key={i} className="color-dot" style={{ background: c.hex }} title={c.name} />
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
