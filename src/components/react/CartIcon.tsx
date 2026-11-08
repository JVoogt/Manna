import { useCartState } from '../../lib/cart-context';

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
      <style>{`
        .cart-icon-link {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--ink);
          min-width: var(--tap, 48px);
          min-height: var(--tap, 48px);
          border-radius: 50%;
          transition: background-color 200ms ease;
        }

        .cart-icon-link:hover {
          background: var(--paper-2);
        }

        .cart-icon-link:active {
          background: var(--paper-3);
        }

        .cart-icon-link:focus-visible {
          outline: 3px solid var(--accent-ink);
          outline-offset: 2px;
        }

        .cart-icon-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cart-icon-svg {
          width: 26px;
          height: 26px;
        }

        .cart-badge {
          position: absolute;
          top: -9px;
          right: -11px;
          background: var(--accent-ink);
          color: var(--on-dark);
          font-size: 0.8125rem;
          font-weight: 700;
          line-height: 1;
          font-variant-numeric: tabular-nums;
          padding: 0.25rem 0.4rem;
          border-radius: 999px;
          min-width: 20px;
          text-align: center;
        }

        @media (prefers-reduced-motion: reduce) {
          .cart-icon-link { transition: none; }
        }
      `}</style>
    </a>
  );
}
