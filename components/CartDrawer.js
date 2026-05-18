'use client';
import { useCart } from '../context/CartContext';
import Link from 'next/link';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />
      <div className="cart-drawer">
        <div className="cart-drawer-header">
          <h3>Shopping Bag ({cart.length})</h3>
          <button onClick={() => setIsCartOpen(false)} className="cart-drawer-close">✕</button>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🛍️</div>
            <p>Your bag is empty</p>
            <button onClick={() => setIsCartOpen(false)} className="btn-primary">Continue Shopping</button>
          </div>
        ) : (
          <>
            <div className="cart-drawer-items">
              {cart.map((item, idx) => (
                <div key={`${item._id}-${item.size}-${item.color}-${idx}`} className="cart-item">
                  <div className="cart-item-img">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <p className="cart-item-variant">
                      {item.size && `Size: ${item.size}`}
                      {item.color && ` | Color: ${item.color}`}
                    </p>
                    <p className="cart-item-price">PKR {item.price?.toLocaleString()}</p>
                    <div className="cart-item-qty">
                      <button onClick={() => updateQuantity(item._id, item.size, item.color, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.size, item.color, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <button className="cart-item-remove" onClick={() => removeFromCart(item._id, item.size, item.color)}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-drawer-footer">
              <div className="cart-subtotal">
                <span>Subtotal</span>
                <span>PKR {cartTotal.toLocaleString()}</span>
              </div>
              <p className="cart-shipping-note">Shipping calculated at checkout</p>
              <Link href="/checkout" className="btn-checkout" onClick={() => setIsCartOpen(false)}>
                Checkout — PKR {cartTotal.toLocaleString()}
              </Link>
              <button className="btn-continue" onClick={() => setIsCartOpen(false)}>Continue Shopping</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
