'use client';
import { useState } from 'react';
import { useToast } from '../../context/ToastContext';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const { addToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    addToast('Message sent! We\'ll get back to you soon. 📩', 'success');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const u = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <>
      <div className="page-banner">
        <div className="page-banner-content">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you</p>
        </div>
      </div>
      <section className="contact-page container">
        <div className="contact-grid">
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', marginBottom: '24px' }}>Get In Touch</h2>
            <p style={{ color: 'var(--text-light)', marginBottom: '32px', lineHeight: '1.8' }}>
              Have a question, suggestion, or just want to say hello? Fill out the form and we'll respond within 24 hours.
            </p>
            <div className="contact-info-card">
              <div className="icon">📍</div>
              <div><h4>Address</h4><p>Karachi, Pakistan</p></div>
            </div>
            <div className="contact-info-card">
              <div className="icon">📞</div>
              <div><h4>Phone</h4><p>+92 300 1234567</p></div>
            </div>
            <div className="contact-info-card">
              <div className="icon">✉️</div>
              <div><h4>Email</h4><p>info@afzariye.com</p></div>
            </div>
            <div className="contact-info-card">
              <div className="icon">🕐</div>
              <div><h4>Hours</h4><p>Mon - Sat: 10am - 8pm</p></div>
            </div>
          </div>
          <div>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Your Name</label>
                  <input type="text" value={form.name} onChange={e => u('name', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={form.email} onChange={e => u('email', e.target.value)} required />
                </div>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input type="text" value={form.subject} onChange={e => u('subject', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea rows={6} value={form.message} onChange={e => u('message', e.target.value)} required />
              </div>
              <button type="submit" className="btn-primary">Send Message</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
