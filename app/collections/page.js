'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  useEffect(() => {
    fetch('/api/collections').then(r => r.json()).then(d => setCollections(d.collections || [])).catch(() => {});
  }, []);

  return (
    <>
      <div className="page-banner">
        <img src="/col1.jpg" alt="Collections" />
        <div className="page-banner-content">
          <h1>Our Collections</h1>
          <p>Explore our carefully curated fashion lines</p>
        </div>
      </div>
      <section className="collections-section container">
        {collections.length > 0 ? (
          <div className="collections-grid">
            {collections.map(col => (
              <Link href={`/collections/${col.slug}`} key={col._id} className="collection-card">
                <img src={col.banner?.url || col.thumbnail?.url || '/placeholder.jpg'} alt={col.name} />
                <div className="collection-card-overlay" />
                <div className="collection-card-content">
                  <h3>{col.name}</h3>
                  <p>{col.description || 'Explore collection →'}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>✨</p>
            <p>Collections coming soon! Add them from the admin panel.</p>
          </div>
        )}
      </section>
    </>
  );
}
