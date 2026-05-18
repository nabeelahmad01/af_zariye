import Link from 'next/link';

export const metadata = { title: 'About Us | AF Zariye', description: 'Learn about AF Zariye - our story, mission, and values.' };

export default function AboutPage() {
  return (
    <>
      <div className="page-banner">
        <div className="page-banner-content">
          <h1>About Us</h1>
          <p>Our story, our passion</p>
        </div>
      </div>
      <section className="about-page container">
        <div className="about-hero">
          <h2>Crafting Elegance Since Day One</h2>
          <p>AF Zariye was born from a passion for fashion and a desire to bring premium, affordable clothing to everyone. We believe that style should be accessible, and every piece in our collection is carefully curated to reflect modern elegance with a touch of tradition.</p>
        </div>

        <div className="about-grid">
          <div className="about-image">
            <img src="/about1.jpg" alt="Our Story" />
          </div>
          <div>
            <p className="section-subtitle">Our Mission</p>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '20px' }}>Redefining Fashion</h2>
            <p style={{ color: 'var(--text-light)', lineHeight: '1.8', marginBottom: '16px' }}>
              At AF Zariye, we're more than just a fashion brand. We're a movement towards conscious, quality-driven fashion that doesn't break the bank. Every stitch, every fabric, and every design is chosen with care.
            </p>
            <p style={{ color: 'var(--text-light)', lineHeight: '1.8', marginBottom: '24px' }}>
              From casual wear to formal attire, our collections are designed to make you feel confident, comfortable, and stylish. We source the finest fabrics and work with skilled artisans to bring you pieces that last.
            </p>
            <Link href="/shop" className="btn-primary">Shop Our Collection</Link>
          </div>
        </div>

        <div className="about-grid" style={{ direction: 'rtl' }}>
          <div className="about-image">
            <img src="/about2.jpg" alt="Quality" />
          </div>
          <div style={{ direction: 'ltr' }}>
            <p className="section-subtitle">Our Values</p>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '20px' }}>Quality Above All</h2>
            <p style={{ color: 'var(--text-light)', lineHeight: '1.8', marginBottom: '16px' }}>
              We believe in quality that speaks for itself. Each product goes through rigorous quality checks before reaching your doorstep.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px' }}>
              {[['✨', 'Premium Fabrics'], ['🌿', 'Sustainable'], ['💯', 'Quality Assured'], ['🤝', 'Fair Trade']].map(([icon, text]) => (
                <div key={text} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '24px' }}>{icon}</span>
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
