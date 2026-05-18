import './globals.css';
import AuthProvider from '../context/AuthProvider';
import { CartProvider } from '../context/CartContext';
import { ToastProvider } from '../context/ToastContext';
import LayoutShell from '../components/LayoutShell';

export const metadata = {
  title: 'AF Zariye | Premium Fashion Store',
  description: 'Discover curated fashion collections at AF Zariye. Shop premium clothing, accessories, and more with free shipping on orders over PKR 5,000.',
  keywords: 'fashion, clothing, online store, Pakistan, AF Zariye, premium fashion',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <LayoutShell>{children}</LayoutShell>
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
