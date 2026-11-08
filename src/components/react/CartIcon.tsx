import { useCartState } from '../../lib/cart-context';
import '../../styles/cart-icon.css';

export function CartIcon() {
  const items = useCartState();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <a
      href="/cart/"
      className="cart-icon-link"
      aria-label={totalItems > 0 ? `Cart, ${totalItems} ${totalItems === 1 ? 'item' : 'items'}` : 'Cart, empty'}
    >
      <div className="cart-icon-container">
        <svg
          className="cart-icon-svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        {totalItems > 0 && (
          <span className="cart-badge" aria-hidden="true">
            {totalItems}
          </span>
        )}
      </div>
    </a>
  );
}
