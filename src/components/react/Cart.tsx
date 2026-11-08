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
        <svg
          className="cart-empty__icon"
          width="56"
          height="56"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        <h2 className="cart-empty__title">Your cart is empty</h2>
        <p className="cart-empty__text">
          Choose your meals from the menu and they will appear here.
        </p>
        <a href="/#menu" className="cart-empty__link">
          Browse the menu
        </a>
        <p className="cart-empty__alt">
          Prefer to order by message?{' '}
          <a href="https://wa.me/27825795210" target="_blank" rel="noopener noreferrer">
            Chat with us on WhatsApp
          </a>
        </p>

        <style>{`
          .cart-empty {
            text-align: center;
            padding: 3rem 1rem;
            max-width: 32rem;
            margin: 0 auto;
          }

          .cart-empty__icon {
            margin: 0 auto 1.25rem;
            color: var(--ink-mute);
          }

          .cart-empty__title {
            font-family: var(--font-display);
            font-size: 1.75rem;
            font-weight: 600;
            color: var(--ink);
            margin: 0 0 0.75rem 0;
          }

          .cart-empty__text {
            font-size: 1.125rem;
            color: var(--ink-soft);
            margin: 0 0 2rem 0;
          }

          .cart-empty__link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: var(--tap, 48px);
            padding: 0 2rem;
            background: var(--accent-ink);
            color: var(--on-dark);
            border-radius: var(--radius);
            font-size: 1.125rem;
            font-weight: 600;
            transition: background-color 200ms ease, transform 120ms ease;
          }

          .cart-empty__link:hover { background: var(--ink); }
          .cart-empty__link:active { transform: translateY(1px); }

          .cart-empty__alt {
            margin: 1.5rem 0 0;
            font-size: 1rem;
            color: var(--ink-soft);
          }

          .cart-empty__alt a {
            color: var(--accent-ink);
            text-decoration: underline;
            text-underline-offset: 0.25em;
            display: inline-block;
            padding: 0.75rem 0;
          }

          .cart-empty__link:focus-visible,
          .cart-empty__alt a:focus-visible {
            outline: 3px solid var(--accent-ink);
            outline-offset: 3px;
          }

          @media (prefers-reduced-motion: reduce) {
            .cart-empty__link { transition: none; }
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

      <aside className="cart__summary" aria-labelledby="cart-summary-title">
        <h2 className="cart__summary-title" id="cart-summary-title">Order summary</h2>

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

        <p className="cart__summary-fee">
          Delivery fee is not included. We quote it on WhatsApp.
        </p>

        <a href="/checkout/" className="cart__checkout-button">
          Go to checkout
        </a>

        <p className="cart__summary-note">
          Need a hand? Message us on WhatsApp:{' '}
          <a href="https://wa.me/27825795210" target="_blank" rel="noopener noreferrer">
            +27 82 579 5210
          </a>
        </p>
      </aside>

      <style>{`
        .cart {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 400px);
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
          top: calc(var(--header-h, 4.5rem) + 1rem);
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: var(--radius);
          padding: 1.5rem;
        }

        .cart__summary-title {
          font-family: var(--font-display);
          font-size: 1.375rem;
          font-weight: 600;
          color: var(--ink);
          margin: 0 0 1.25rem 0;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--line);
        }

        .cart__summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .cart__summary-row--total {
          margin-top: 1.25rem;
          padding-top: 1rem;
          border-top: 1px solid var(--line);
        }

        .cart__summary-label {
          font-size: 1.0625rem;
          color: var(--ink-soft);
        }

        .cart__summary-value {
          font-size: 1.0625rem;
          font-weight: 600;
          color: var(--ink);
          font-variant-numeric: tabular-nums;
        }

        .cart__summary-value--total {
          font-size: 1.625rem;
          font-weight: 700;
        }

        .cart__summary-fee {
          font-size: 1rem;
          color: var(--ink-soft);
          margin: 0;
        }

        .cart__checkout-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 3.25rem;
          padding: 0 1rem;
          background: var(--accent-ink);
          color: var(--on-dark);
          border-radius: var(--radius);
          font-size: 1.125rem;
          font-weight: 600;
          text-align: center;
          margin-top: 1.5rem;
          transition: background-color 200ms ease, transform 120ms ease;
        }

        .cart__checkout-button:hover { background: var(--ink); }
        .cart__checkout-button:active { transform: translateY(1px); }

        .cart__summary-note {
          font-size: 1rem;
          color: var(--ink-soft);
          text-align: center;
          margin: 1rem 0 0 0;
        }

        .cart__summary-note a {
          color: var(--accent-ink);
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 0.25em;
          display: inline-block;
          padding: 0.75rem 0;
        }

        .cart__checkout-button:focus-visible,
        .cart__summary-note a:focus-visible {
          outline: 3px solid var(--accent-ink);
          outline-offset: 3px;
        }

        /* Mobile responsive - stack vertically */
        @media (max-width: 768px) {
          .cart {
            grid-template-columns: minmax(0, 1fr);
          }

          .cart__summary {
            position: static;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cart__checkout-button { transition: none; }
        }
      `}</style>
    </div>
  );
}
