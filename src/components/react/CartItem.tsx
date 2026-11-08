import React from 'react';
import type { CartItem as CartItemType } from '../../types/cart';
import { useCartActions } from '../../lib/cart-context';
import '../../styles/cart-item.css';

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

    </div>
  );
}
