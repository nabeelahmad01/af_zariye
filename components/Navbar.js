"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { data: session } = useSession();
  const { cartCount, setIsCartOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <p>
          ✨ Free Shipping on Orders Over PKR 5,000 | Use Code:{" "}
          <strong>ZARIYE10</strong> for 10% Off
        </p>
      </div>

      <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
        <div className="nav-container">
          {/* Mobile Menu Toggle */}
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span className={`hamburger ${menuOpen ? "active" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          {/* Logo */}
          <Link href="/" className="nav-logo">
            <img src="/logo.png" alt="AF Zariye Logo" className="site-logo" />
          </Link>

          {/* Desktop Navigation */}
          <div className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
            <Link href="/shop" onClick={() => setMenuOpen(false)}>
              Shop
            </Link>
            <Link href="/collections" onClick={() => setMenuOpen(false)}>
              Collections
            </Link>
            <Link href="/about" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
            <Link href="/my-orders" onClick={() => setMenuOpen(false)}>
              My Orders
            </Link>
            <Link href="/track-order" onClick={() => setMenuOpen(false)}>
              Track Order
            </Link>
          </div>

          {/* Right Actions */}
          <div className="nav-actions">
            {/* Search */}
            <button
              className="nav-icon-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
            </button>

            {/* Account */}
            {session ? (
              <div className="nav-dropdown">
                <button className="nav-icon-btn" aria-label="Account">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </button>
                <div className="dropdown-menu">
                  <span className="dropdown-name">Hi, {session.user.name}</span>
                  {session.user.role === "admin" && (
                    <Link href="/admin">Admin Panel</Link>
                  )}
                  <button onClick={() => signOut()}>Logout</button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="nav-icon-btn" aria-label="Login">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
            )}

            {/* Cart */}
            <button
              className="nav-icon-btn cart-btn"
              onClick={() => setIsCartOpen(true)}
              aria-label="Cart"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>
        </div>

        {/* Search Overlay */}
        {searchOpen && (
          <div className="search-overlay">
            <div className="search-container">
              <form onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) { router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`); setSearchOpen(false); setSearchQuery(''); } }}>
              <input
                type="text"
                placeholder="Search products..."
                autoFocus
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              </form>
              <button
                className="search-close"
                onClick={() => setSearchOpen(false)}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Overlay */}
      {menuOpen && (
        <div className="nav-overlay" onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
}
