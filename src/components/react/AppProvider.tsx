import { CartProvider } from '@/lib/cart-context';
import { ToastProvider } from './ToastProvider';
import { CartIcon } from './CartIcon';
import HomePage from './HomePage';
import CartPage from './CartPage';
import CheckoutPage from './CheckoutPage';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Product } from '@/schemas/product.schema';
import type { Meal } from '@/schemas/meal.schema';

interface AppProviderProps {
  page: 'home' | 'cart' | 'checkout';
  products?: Product[];
  meals?: Meal[];
}

export default function AppProvider({ page, products, meals }: AppProviderProps) {
  const [cartIconMountPoint, setCartIconMountPoint] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Find the cart icon mount point in the DOM
    const mountPoint = document.getElementById('cart-icon-root');
    setCartIconMountPoint(mountPoint);
  }, []);

  let PageComponent;
  if (page === 'home' && products && meals) {
    PageComponent = <HomePage products={products} meals={meals} />;
  } else if (page === 'cart') {
    PageComponent = <CartPage />;
  } else if (page === 'checkout') {
    PageComponent = <CheckoutPage />;
  } else {
    PageComponent = null;
  }

  return (
    <CartProvider>
      <ToastProvider />

      {/* Portal CartIcon into the header */}
      {cartIconMountPoint && createPortal(<CartIcon />, cartIconMountPoint)}

      {/* Page content */}
      {PageComponent}
    </CartProvider>
  );
}
