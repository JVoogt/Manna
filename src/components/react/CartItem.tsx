import React from 'react';
import type { CartItem as CartItemType } from '../../types/cart';
import { useCartActions } from '../../lib/cart-context';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartActions();

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      // At quantity 1 the minus button is disabled; removal is the explicit Remove button.
      removeItem(item.id);
    }
  };

  const handleIncrease = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  const lineTotal = item.price * item.quantity;

  return (
    <div className="cart-item">
      <div className="cart-item__details">
        <h3 className="cart-item__name">{item.name}</h3>
        <p className="cart-item__price">R{item.price.toFixed(2)} each</p>
      </div>

      <div className="cart-item__controls" role="group" aria-label={`Quantity of ${item.name}`}>
        <button
          type="button"
          onClick={handleDecrease}
          disabled={item.quantity <= 1}
          className="cart-item__button cart-item__button--minus"
          aria-label={`Decrease quantity of ${item.name}`}
        >
          −
        </button>
        <span className="cart-item__quantity" aria-live="polite">{item.quantity}</span>
        <button
          type="button"
          onClick={handleIncrease}
          className="cart-item__button cart-item__button--plus"
          aria-label={`Increase quantity of ${item.name}`}
        >
          +
        </button>
      </div>

      <div className="cart-item__total">
        <p className="cart-item__line-total">R{lineTotal.toFixed(2)}</p>
        <button
          type="button"
          onClick={handleRemove}
          className="cart-item__remove"
          aria-label={`Remove ${item.name} from cart`}
        >
          Remove
        </button>
      </div>

      <style>{`
        .cart-item {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto auto;
          gap: 1rem 1.5rem;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid var(--line);
        }

        .cart-item__details {
          min-width: 0;
        }

        .cart-item__name {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 600;
          line-height: 1.25;
          color: var(--ink);
          margin: 0 0 0.25rem 0;
          overflow-wrap: break-word;
          min-width: 0;
        }

        .cart-item__price {
          font-size: 1rem;
          color: var(--ink-soft);
          margin: 0;
          font-variant-numeric: tabular-nums;
        }

        .cart-item__controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .cart-item__button {
          width: var(--tap, 48px);
          height: var(--tap, 48px);
          border: 2px solid var(--field-edge);
          border-radius: var(--radius);
          background: var(--surface);
          color: var(--ink);
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease, transform 120ms ease;
        }

        .cart-item__button:hover:not(:disabled) {
          background: var(--accent-ink);
          color: var(--on-dark);
          border-color: var(--accent-ink);
        }

        .cart-item__button:active:not(:disabled) {
          transform: translateY(1px);
        }

        .cart-item__button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .cart-item__quantity {
          min-width: 2.5ch;
          text-align: center;
          font-weight: 700;
          font-size: 1.25rem;
          font-variant-numeric: tabular-nums;
        }

        .cart-item__total {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
          min-width: 6rem;
        }

        .cart-item__line-total {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--ink);
          margin: 0;
          font-variant-numeric: tabular-nums;
        }

        .cart-item__remove {
          min-height: var(--tap, 48px);
          padding: 0 0.75rem;
          border-radius: var(--radius);
          color: var(--danger);
          font-size: 1rem;
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 0.25em;
          transition: background-color 200ms ease;
        }

        .cart-item__remove:hover { background: var(--danger-wash); }
        .cart-item__remove:active { background: var(--danger-wash); transform: translateY(1px); }

        .cart-item__button:focus-visible,
        .cart-item__remove:focus-visible {
          outline: 3px solid var(--accent-ink);
          outline-offset: 2px;
        }

        /* Mobile responsive - stack vertically on narrow screens */
        @media (max-width: 640px) {
          .cart-item {
            grid-template-columns: minmax(0, 1fr) auto;
            gap: 0.75rem 1rem;
          }

          .cart-item__details {
            grid-column: 1 / -1;
          }

          .cart-item__controls {
            grid-column: 1;
          }

          .cart-item__total {
            grid-column: 2;
            align-items: flex-end;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cart-item__button,
          .cart-item__remove { transition: none; }
        }
      `}</style>
    </div>
  );
}
