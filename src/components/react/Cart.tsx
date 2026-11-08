import React from 'react';
import { useCartState } from '../../lib/cart-context';
import { CartItem } from './CartItem';
import { WA_BASE, WA_DISPLAY } from '../../lib/site';
import '../../styles/cart.css';

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
          <a href={WA_BASE} target="_blank" rel="noopener noreferrer">
            Chat with us on WhatsApp
          </a>
        </p>
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
          <a href={WA_BASE} target="_blank" rel="noopener noreferrer">
            {WA_DISPLAY}
          </a>
        </p>
      </aside>

    </div>
  );
}
