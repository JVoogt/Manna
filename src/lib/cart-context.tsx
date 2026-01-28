import React, { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import type { CartItem } from '../types/cart';

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

const STORAGE_KEY = 'manna-cart';

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Initialize from localStorage on mount (NOT in useState to avoid SSR issues)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
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
              ? { ...i, quantity: i.quantity + item.quantity }
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
