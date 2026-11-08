import { CartProvider } from '@/lib/cart-context';
import { ToastProvider } from './ToastProvider';
import { CartIcon } from './CartIcon';
import HomePage from './HomePage';
import { lazy, Suspense, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Meal } from '@/schemas/meal.schema';

// Cart and checkout code (forms, phone and date libraries) loads only on its own route.
const CartPage = lazy(() => import('./CartPage'));
const CheckoutPage = lazy(() => import('./CheckoutPage'));

interface AppProviderProps {
  page: 'home' | 'cart' | 'checkout';
  meals?: Meal[];
}

export default function AppProvider({ page, meals }: AppProviderProps) {
  const [cartIconMountPoint, setCartIconMountPoint] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Find the cart icon mount point in the DOM
    const mountPoint = document.getElementById('cart-icon-root');
    setCartIconMountPoint(mountPoint);
  }, []);

  let PageComponent;
  if (page === 'home' && meals) {
    PageComponent = <HomePage meals={meals} />;
  } else if (page === 'cart') {
    PageComponent = <Suspense fallback={null}><CartPage /></Suspense>;
  } else if (page === 'checkout') {
    PageComponent = <Suspense fallback={null}><CheckoutPage /></Suspense>;
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
