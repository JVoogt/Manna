import React, { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import { toast } from 'sonner';
import type { CartItem } from '../types/cart';
import { getMeals } from './content';

// Separated contexts for performance
const CartStateContext = createContext<CartItem[] | undefined>(undefined);
const CartActionsContext = createContext<CartActions | undefined>(undefined);

interface CartActions {
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

interface CartProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'manna-cart-v2';
const LEGACY_STORAGE_KEY = 'manna-cart';
const MAX_QUANTITY = 20;

const clampQuantity = (q: unknown): number => {
  const n = Math.floor(Number(q));
  return Number.isFinite(n) ? Math.min(MAX_QUANTITY, Math.max(1, n)) : 1;
};

/**
 * Reconcile a stored cart against the current catalogue: drop ids that are not
 * an available meal, take name and price from the catalogue, clamp quantity.
 * Only 'meal' items are ever created; the 'product' type is kept in the CartItem union only.
 */
function reconcileCart(stored: unknown[]): { items: CartItem[]; changed: boolean } {
  const catalogue = new Map(getMeals().map(m => [m.id, m]));
  const items: CartItem[] = [];
  let changed = false;
  for (const raw of stored) {
    const entry = raw as Partial<CartItem> | null;
    const meal = entry && typeof entry.id === 'string' ? catalogue.get(entry.id) : undefined;
    if (!entry || !meal) {
      changed = true;
      continue;
    }
    const quantity = clampQuantity(entry.quantity);
    if (entry.name !== meal.name || entry.price !== meal.price || entry.quantity !== quantity) changed = true;
    items.push({ id: meal.id, name: meal.name, price: meal.price, quantity, imageUrl: meal.imageUrl, type: 'meal' });
  }
  return { items, changed };
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Initialize from localStorage on mount (NOT in useState to avoid SSR issues)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      // The old key held carts priced against the previous catalogue: discard it once
      localStorage.removeItem(LEGACY_STORAGE_KEY);

      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const { items: reconciled, changed } = reconcileCart(parsed);
          setItems(reconciled);
          if (changed) toast('Some items in your order changed or are no longer available');
        }
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);

  // Sync to localStorage on changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
      // Handle quota exceeded errors gracefully
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded');
      }
    }
  }, [items]);

  // Memoize actions to prevent re-renders
  const actions = useMemo<CartActions>(() => ({
    addItem: (item: CartItem) => {
      setItems(prev => {
        const existing = prev.find(i => i.id === item.id);
        if (existing) {
          // Update quantity if item exists
          return prev.map(i =>
            i.id === item.id
              ? { ...i, quantity: Math.min(MAX_QUANTITY, i.quantity + item.quantity) }
              : i
          );
        }
        // Add new item
        return [...prev, item];
      });
    },

    removeItem: (id: string) => {
      setItems(prev => prev.filter(i => i.id !== id));
    },

    updateQuantity: (id: string, quantity: number) => {
      if (!Number.isInteger(quantity) || quantity > MAX_QUANTITY) return;
      if (quantity <= 0) {
        setItems(prev => prev.filter(i => i.id !== id));
      } else {
        setItems(prev =>
          prev.map(i => (i.id === id ? { ...i, quantity } : i))
        );
      }
    },

    clearCart: () => {
      setItems([]);
    }
  }), []); // Empty deps - functions use functional updates

  return (
    <CartStateContext.Provider value={items}>
      <CartActionsContext.Provider value={actions}>
        {children}
      </CartActionsContext.Provider>
    </CartStateContext.Provider>
  );
}

// Hook to access cart state (read-only)
export function useCartState() {
  const context = useContext(CartStateContext);
  if (context === undefined) {
    throw new Error('useCartState must be used within CartProvider');
  }
  return context;
}

// Hook to access cart actions (write-only)
export function useCartActions() {
  const context = useContext(CartActionsContext);
  if (context === undefined) {
    throw new Error('useCartActions must be used within CartProvider');
  }
  return context;
}
