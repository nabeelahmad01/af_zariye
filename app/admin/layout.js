'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    if (status === 'authenticated' && session?.user?.role !== 'admin') router.push('/');
  }, [status, session, router]);

  if (status === 'loading') return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  if (session?.user?.role !== 'admin') return null;

  const links = [
    { href: '/admin', label: '📊 Dashboard', exact: true },
    { href: '/admin/products', label: '📦 Products' },
    { href: '/admin/collections', label: '🏷️ Collections' },
    { href: '/admin/orders', label: '🛒 Orders' },
    { href: '/admin/newsletter', label: '📧 Newsletter' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <span className="logo-text">AF</span>
          <span className="logo-sub">ADMIN</span>
        </div>
        <nav className="admin-nav">
          {links.map(link => (
            <Link key={link.href} href={link.href}
              className={link.exact ? (pathname === link.href ? 'active' : '') : (pathname.startsWith(link.href) ? 'active' : '')}>
              {link.label}
            </Link>
          ))}
          <Link href="/" style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
            🌐 View Store
          </Link>
        </nav>
      </aside>
      <div className="admin-content">{children}</div>
    </div>
  );
}
