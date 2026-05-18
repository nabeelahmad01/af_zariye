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
      <section className="container">
        <div className="features-strip">
          <div className="feature-item">
            <span className="feature-icon">🚚</span>
            <h4>Free Shipping</h4>
            <p>On orders over PKR 5,000</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔄</span>
            <h4>Easy Returns</h4>
            <p>7-day return policy</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">💎</span>
            <h4>Premium Quality</h4>
            <p>Handpicked fabrics</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📞</span>
            <h4>24/7 Support</h4>
            <p>WhatsApp & call</p>
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
