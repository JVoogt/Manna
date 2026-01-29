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
      // When quantity is 1, decrease = remove
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
        <p className="cart-item__price">R{item.price.toFixed(2)}</p>
      </div>

      <div className="cart-item__controls">
        <button
          type="button"
          onClick={handleDecrease}
          className="cart-item__button cart-item__button--minus"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="cart-item__quantity">{item.quantity}</span>
        <button
          type="button"
          onClick={handleIncrease}
          className="cart-item__button cart-item__button--plus"
          aria-label="Increase quantity"
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
          aria-label="Remove item"
        >
          ×
        </button>
      </div>

      <style>{`
        .cart-item {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 1rem;
          align-items: center;
          padding: 1rem;
          border: 1px solid var(--color-border, #e5e5e5);
          border-radius: 8px;
          background: white;
        }

        .cart-item__details {
          min-width: 0;
        }

        .cart-item__name {
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-text-dark, #333);
          margin: 0 0 0.25rem 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .cart-item__price {
          font-size: 0.875rem;
          color: var(--color-text-light, #666);
          margin: 0;
        }

        .cart-item__controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .cart-item__button {
          width: 44px;
          height: 44px;
          border: 1px solid var(--color-border, #e5e5e5);
          border-radius: 4px;
          background: white;
          color: var(--color-primary, #8b5a3c);
          font-size: 1.25rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .cart-item__button:hover {
          background: var(--color-primary, #8b5a3c);
          color: white;
          border-color: var(--color-primary, #8b5a3c);
        }

        .cart-item__button:active {
          transform: scale(0.95);
        }

        .cart-item__quantity {
          min-width: 2ch;
          text-align: center;
          font-weight: 600;
          font-size: 1rem;
        }

        .cart-item__total {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
        }

        .cart-item__line-total {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--color-primary, #8b5a3c);
          margin: 0;
        }

        .cart-item__remove {
          width: 44px;
          height: 44px;
          border: 1px solid #dc2626;
          border-radius: 4px;
          background: white;
          color: #dc2626;
          font-size: 1.5rem;
          font-weight: 400;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .cart-item__remove:hover {
          background: #dc2626;
          color: white;
        }

        .cart-item__remove:active {
          transform: scale(0.95);
        }

        /* Mobile responsive - stack vertically on narrow screens */
        @media (max-width: 640px) {
          .cart-item {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto auto;
            gap: 0.75rem;
          }

          .cart-item__details {
            grid-column: 1;
            grid-row: 1;
          }

          .cart-item__controls {
            grid-column: 1;
            grid-row: 2;
            justify-content: flex-start;
          }

          .cart-item__total {
            grid-column: 1;
            grid-row: 3;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding-top: 0.75rem;
            margin-top: 0.75rem;
            border-top: 1px solid var(--color-border, #e5e5e5);
          }
        }
      `}</style>
    </div>
  );
}
