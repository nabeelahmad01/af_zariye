"use client";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "../context/ToastContext";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        addToast("Subscribed successfully! 🎉", "success");
        setEmail("");
      } else {
        addToast(data.error || "Failed to subscribe", "error");
      }
    } catch {
      addToast("Something went wrong", "error");
    }
    setLoading(false);
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-container">
          <div className="footer-col footer-brand">
            <Link href="/" className="footer-logo" style={{ display: 'inline-block', marginBottom: '20px' }}>
              <img src="/logo.png" alt="AF Zariye Logo" className="site-logo" style={{ height: '80px' }} />
            </Link>
            <p className="footer-desc">
              Elevating your style with curated fashion pieces that blend
              tradition with modern elegance.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Instagram" className="social-link">
                📷
              </a>
              <a href="#" aria-label="Facebook" className="social-link">
                📘
              </a>
              <a href="#" aria-label="TikTok" className="social-link">
                🎵
              </a>
              <a href="#" aria-label="WhatsApp" className="social-link">
                💬
              </a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <Link href="/shop">Shop All</Link>
            <Link href="/collections">Collections</Link>
            <Link href="/about">About Us</Link>
            <Link href="/contact">Contact Us</Link>
            <Link href="/my-orders">My Orders</Link>
            <Link href="/track-order">Track Order</Link>
          </div>
          <div className="footer-col">
            <h4>Help & Info</h4>
            <Link href="/contact">Shipping Policy</Link>
            <Link href="/contact">Return Policy</Link>
            <Link href="/contact">Size Guide</Link>
            <Link href="/contact">FAQ</Link>
          </div>
          <div className="footer-col footer-newsletter">
            <h4>Stay Connected</h4>
            <p>Subscribe for special offers and new arrivals.</p>
            <form onSubmit={handleNewsletter} className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "..." : "→"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 AF Zariye. All rights reserved.</p>
        {/* <div className="payment-methods">
          <span>💳 COD</span>
          <span>🏦 Bank Transfer</span>
          <span>📱 JazzCash</span>
          <span>📱 EasyPaisa</span>
        </div> */}
      </div>
    </footer>
  );
}
