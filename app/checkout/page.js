'use client';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { addToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', street: '', city: '', state: '', zip: '', paymentMethod: 'cod', notes: '',
  });

  const shipping = cartTotal >= 5000 ? 0 : 200;
  const total = cartTotal + shipping;
  const u = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) { addToast('Your cart is empty', 'error'); return; }
    setLoading(true);
    try {
      const orderData = {
        customerInfo: { name: form.name, email: form.email, phone: form.phone, address: { street: form.street, city: form.city, state: form.state, zip: form.zip } },
        items: cart.map(item => ({ product: item._id, name: item.name, image: item.image, price: item.price, size: item.size, color: item.color, quantity: item.quantity })),
        subtotal: cartTotal, shippingCost: shipping, total, paymentMethod: form.paymentMethod, notes: form.notes,
      };
      const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderData) });
      const data = await res.json();
      if (res.ok) {
        clearCart();
        addToast(`Order placed! ID: ${data.orderId} 🎉`, 'success');
        router.push(`/track-order?id=${data.orderId}`);
      } else { addToast(data.error || 'Order failed', 'error'); }
    } catch { addToast('Something went wrong', 'error'); }
    setLoading(false);
  };

  if (cart.length === 0) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <p style={{ fontSize: '48px' }}>🛒</p>
        <h2>Your cart is empty</h2>
        <a href="/shop" className="btn-primary">Continue Shopping</a>
      </div>
    );
  }

  return (
    <section className="checkout-page container">
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', marginBottom: '40px' }}>Checkout</h1>
      <form onSubmit={handleOrder}>
        <div className="checkout-grid">
          <div>
            <div className="checkout-section">
              <h3>Contact Information</h3>
              <div className="form-row">
                <div className="form-group"><label>Full Name *</label><input required value={form.name} onChange={e => u('name', e.target.value)} /></div>
                <div className="form-group"><label>Email *</label><input type="email" required value={form.email} onChange={e => u('email', e.target.value)} /></div>
              </div>
              <div className="form-group"><label>Phone *</label><input type="tel" required value={form.phone} onChange={e => u('phone', e.target.value)} placeholder="+92 3XX XXXXXXX" /></div>
            </div>
            <div className="checkout-section">
              <h3>Shipping Address</h3>
              <div className="form-group"><label>Street Address *</label><input required value={form.street} onChange={e => u('street', e.target.value)} /></div>
              <div className="form-row">
                <div className="form-group"><label>City *</label><input required value={form.city} onChange={e => u('city', e.target.value)} /></div>
                <div className="form-group"><label>State/Province</label><input value={form.state} onChange={e => u('state', e.target.value)} /></div>
              </div>
              <div className="form-group"><label>Zip Code</label><input value={form.zip} onChange={e => u('zip', e.target.value)} /></div>
            </div>
            <div className="checkout-section">
              <h3>Payment Method</h3>
              {[['cod', '💵 Cash on Delivery'], ['bank_transfer', '🏦 Bank Transfer']].map(([val, label]) => (
                <label key={val} className="filter-option" style={{ cursor: 'pointer', padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: '8px', background: form.paymentMethod === val ? 'var(--bg-alt)' : '' }}>
                  <input type="radio" name="payment" value={val} checked={form.paymentMethod === val} onChange={e => u('paymentMethod', e.target.value)} />
                  {label}
                </label>
              ))}
            </div>
            <div className="form-group"><label>Order Notes (Optional)</label><textarea rows={3} value={form.notes} onChange={e => u('notes', e.target.value)} placeholder="Special instructions..." /></div>
          </div>
          <div>
            <div className="order-summary">
              <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>Order Summary</h3>
              {cart.map((item, i) => (
                <div key={i} className="summary-item">
                  <div className="summary-item-img"><img src={item.image} alt={item.name} /></div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '500', fontSize: '14px' }}>{item.name}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.size} {item.color && `/ ${item.color}`} × {item.quantity}</p>
                  </div>
                  <p style={{ fontWeight: '600', fontSize: '14px' }}>PKR {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
              <div className="summary-row"><span>Subtotal</span><span>PKR {cartTotal.toLocaleString()}</span></div>
              <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `PKR ${shipping}`}</span></div>
              <div className="summary-total"><span>Total</span><span>PKR {total.toLocaleString()}</span></div>
              <button type="submit" className="btn-checkout" style={{ marginTop: '16px' }} disabled={loading}>
                {loading ? 'Placing Order...' : `Place Order — PKR ${total.toLocaleString()}`}
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
