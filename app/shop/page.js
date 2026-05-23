'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '../../components/ProductCard';

function ShopPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('-createdAt');
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const categories = ['All', 'Men', 'Women', 'Unisex', 'Accessories', 'Footwear'];

  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setSearch(q);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 12, sort });
    if (category && category !== 'All') params.set('category', category);
    if (search) params.set('search', search);

    fetch(`/api/products?${params}`).then(r => r.json()).then(d => {
      setProducts(d.products || []);
      setTotalPages(d.pages || 1);
      setTotal(d.total || 0);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [sort, category, page, search]);

  return (
    <>
      <div className="page-banner">
        <img src="/shop-banner.jpg" alt="Shop" />
        <div className="page-banner-content">
          <h1>{search ? `Search: "${search}"` : 'Shop All'}</h1>
          <p>{search ? `${total} results found` : 'Discover our curated collection of premium fashion'}</p>
          <div className="breadcrumb">
            <a href="/">Home</a> <span>/</span> <span>Shop</span>
          </div>
        </div>
      </div>

      <section className="shop-page container">
        <div className="shop-toolbar">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {search && (
              <button onClick={() => setSearch('')}
                style={{ padding: '8px 16px', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', border: '1px solid var(--error)', background: 'transparent', color: 'var(--error)', transition: 'all 0.3s ease' }}>
                ✕ Clear Search
              </button>
            )}
            {categories.map(cat => (
              <button key={cat} onClick={() => { setCategory(cat === 'All' ? '' : cat); setPage(1); }}
                style={{
                  padding: '8px 16px', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase',
                  border: '1px solid var(--border)', background: (category === cat || (!category && cat === 'All')) ? 'var(--primary)' : 'transparent',
                  color: (category === cat || (!category && cat === 'All')) ? '#fff' : 'var(--text)', transition: 'all 0.3s ease',
                }}>
                {cat}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{total} products</span>
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <div className="loader"></div>
            <p>Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="products-grid">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px' }}>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)}
                    style={{
                      width: '40px', height: '40px', border: '1px solid var(--border)',
                      background: page === i + 1 ? 'var(--primary)' : '#fff',
                      color: page === i + 1 ? '#fff' : 'var(--text)', fontWeight: '600', fontSize: '14px',
                    }}>
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>🛍️</p>
            <p>{search ? 'No products match your search.' : 'No products found.'}</p>
          </div>
        )}
      </section>
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
        <div className="loader"></div>
        <p>Loading shop...</p>
      </div>
    }>
      <ShopPageContent />
    </Suspense>
  );
}
