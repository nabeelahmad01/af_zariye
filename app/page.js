'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import HeroSwiper from '../components/HeroSwiper';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    fetch('/api/products?featured=true&limit=8').then(r => r.json()).then(d => setProducts(d.products || [])).catch(() => {});
    fetch('/api/collections?featured=true').then(r => r.json()).then(d => setCollections(d.collections || [])).catch(() => {});
  }, []);

  return (
    <>
      <HeroSwiper />

      {/* Features Strip */}
      <section className="container" style={{ padding: '60px 20px' }}>
        <div className="features-strip premium-features">
          <div className="feature-item">
            <div className="feature-icon-wrapper">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            <div className="feature-text">
              <h4>Free Shipping</h4>
              <p>On orders over PKR 5,000</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon-wrapper">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
            </div>
            <div className="feature-text">
              <h4>Easy Returns</h4>
              <p>7-day return policy</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon-wrapper">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <div className="feature-text">
              <h4>Premium Quality</h4>
              <p>Handpicked fabrics</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon-wrapper">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <div className="feature-text">
              <h4>24/7 Support</h4>
              <p>WhatsApp & call</p>
            </div>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="collections-section container">
        <div className="section-header">
          <p className="section-subtitle">Curated For You</p>
          <h2 className="section-title">Our Collections</h2>
        </div>
        <div className="collections-grid">
          {collections.length > 0 ? collections.map(col => (
            <Link href={`/collections/${col.slug}`} key={col._id} className="collection-card">
              <img src={col.banner?.url || col.thumbnail?.url || '/placeholder.jpg'} alt={col.name} />
              <div className="collection-card-overlay" />
              <div className="collection-card-content">
                <h3>{col.name}</h3>
                <p>{col.description || 'Explore collection →'}</p>
              </div>
            </Link>
          )) : (
            <>
              {['Summer Essentials', 'Formal Wear', 'Casual Collection'].map((name, i) => (
                <Link href="/collections" key={i} className="collection-card">
                  <img src={`/col${i + 1}.jpg`} alt={name} />
                  <div className="collection-card-overlay" />
                  <div className="collection-card-content">
                    <h3>{name}</h3>
                    <p>Explore collection →</p>
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <p className="section-subtitle">Trending Now</p>
            <h2 className="section-title">Featured Products</h2>
          </div>
          <div className="products-grid">
            {products.length > 0 ? products.map(p => (
              <ProductCard key={p._id} product={p} />
            )) : (
              <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                Products will appear here once added from admin panel.
              </p>
            )}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href="/shop" className="btn-secondary">View All Products</Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container">
          <h2>Elevate Your Wardrobe</h2>
          <p>Join the AF Zariye family and get 10% off your first order</p>
          <Link href="/shop" className="btn-accent">Shop Now</Link>
        </div>
      </section>
    </>
  );
}
