'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '../../context/ToastContext';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        addToast('Account created! Please sign in. 🎉', 'success');
        router.push('/login');
      } else {
        addToast(data.error || 'Registration failed', 'error');
      }
    } catch {
      addToast('Something went wrong', 'error');
    }
    setLoading(false);
  };

  const updateForm = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <span className="logo-text" style={{ fontSize: '32px' }}>AF</span>
          <span className="logo-sub" style={{ display: 'block' }}>ZARIYE</span>
        </div>
        <h1>Create Account</h1>
        <p className="auth-subtitle">Join the AF Zariye family</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={form.name} onChange={e => updateForm('name', e.target.value)} placeholder="Your name" required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={form.email} onChange={e => updateForm('email', e.target.value)} placeholder="your@email.com" required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" value={form.phone} onChange={e => updateForm('phone', e.target.value)} placeholder="+92 3XX XXXXXXX" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={form.password} onChange={e => updateForm('password', e.target.value)} placeholder="Min 6 characters" required minLength={6} />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-link">Already have an account? <Link href="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
