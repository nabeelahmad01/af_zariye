'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '../../../components/ProductCard';

export default function CollectionDetailPage() {
  const { slug } = useParams();
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/collections/${slug}`).then(r => r.json()).then(d => {
      setCollection(d.collection);
      setProducts(d.products || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Loading...</p></div>;

  return (
    <>
      <div className="page-banner">
        <img src={collection?.banner?.url || '/placeholder.jpg'} alt={collection?.name} />
        <div className="page-banner-content">
          <h1>{collection?.name || 'Collection'}</h1>
          <p>{collection?.description || ''}</p>
          <div className="breadcrumb">
            <a href="/">Home</a> <span>/</span> <a href="/collections">Collections</a> <span>/</span> <span>{collection?.name}</span>
          </div>
        </div>
      </div>
      <section className="shop-page container">
        {products.length > 0 ? (
          <div className="products-grid">{products.map(p => <ProductCard key={p._id} product={p} />)}</div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <p>No products in this collection yet.</p>
          </div>
        )}
      </section>
    </>
  );
}
