import React from 'react';
import { useCartState } from '../../lib/cart-context';
import { CartItem } from './CartItem';

export default function Cart() {
  const items = useCartState();

  // Calculate totals
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty__icon">🛒</div>
        <h2 className="cart-empty__title">Your cart is empty</h2>
        <p className="cart-empty__text">
          Looks like you haven't added any items to your cart yet.
        </p>
        <a href="/" className="cart-empty__link">
          Browse our menu
        </a>

        <style>{`
          .cart-empty {
            text-align: center;
            padding: 4rem 2rem;
            max-width: 500px;
            margin: 0 auto;
          }

          .cart-empty__icon {
            font-size: 4rem;
            margin-bottom: 1.5rem;
          }

          .cart-empty__title {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--color-text-dark, #333);
            margin: 0 0 0.75rem 0;
          }

          .cart-empty__text {
            font-size: 1rem;
            color: var(--color-text-light, #666);
            margin: 0 0 2rem 0;
          }

          .cart-empty__link {
            display: inline-block;
            padding: 0.875rem 2rem;
            background: var(--color-primary, #8b5a3c);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: background 0.2s;
          }

          .cart-empty__link:hover {
            background: var(--color-text-dark, #6b4423);
          }
        `}</style>
      </div>
    );
  }

  // Cart with items
  return (
    <div className="cart">
      <div className="cart__items">
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      <div className="cart__summary">
        <div className="cart__summary-card">
          <h2 className="cart__summary-title">Order Summary</h2>

          <div className="cart__summary-row">
            <span className="cart__summary-label">Items</span>
            <span className="cart__summary-value">{itemCount}</span>
          </div>

          <div className="cart__summary-row cart__summary-row--total">
            <span className="cart__summary-label">Subtotal</span>
            <span className="cart__summary-value cart__summary-value--total">
              R{subtotal.toFixed(2)}
            </span>
          </div>

          <a href="/checkout/" className="cart__checkout-button">
            Proceed to Checkout
          </a>

          <p className="cart__summary-note">
            Having trouble? Contact us: +27 82 579 5210
          </p>
        </div>
      </div>

      <style>{`
        .cart {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 2rem;
          align-items: start;
        }

        .cart__items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cart__summary {
          position: sticky;
          top: 1rem;
        }

        .cart__summary-card {
          background: white;
          border: 1px solid var(--color-border, #e5e5e5);
          border-radius: 8px;
          padding: 1.5rem;
        }

        .cart__summary-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-text-dark, #333);
          margin: 0 0 1.5rem 0;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--color-border, #e5e5e5);
        }

        .cart__summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .cart__summary-row--total {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid var(--color-border, #e5e5e5);
        }

        .cart__summary-label {
          font-size: 1rem;
          color: var(--color-text-light, #666);
        }

        .cart__summary-value {
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-text-dark, #333);
        }

        .cart__summary-value--total {
          font-size: 1.5rem;
          color: var(--color-primary, #8b5a3c);
        }

        .cart__checkout-button {
          display: block;
          width: 100%;
          padding: 1rem;
          background: var(--color-primary, #8b5a3c);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          text-align: center;
          text-decoration: none;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          margin-top: 1.5rem;
          min-height: 44px;
          line-height: 1.5;
        }

        .cart__checkout-button:hover {
          background: var(--color-text-dark, #6b4423);
        }

        .cart__checkout-button:active {
          transform: scale(0.98);
        }

        .cart__summary-note {
          font-size: 0.875rem;
          color: var(--color-text-light, #666);
          text-align: center;
          margin: 1rem 0 0 0;
        }

        /* Mobile responsive - stack vertically */
        @media (max-width: 768px) {
          .cart {
            grid-template-columns: 1fr;
          }

          .cart__summary {
            position: static;
            order: 2;
          }

          .cart__items {
            order: 1;
          }
        }
      `}</style>
    </div>
  );
}
