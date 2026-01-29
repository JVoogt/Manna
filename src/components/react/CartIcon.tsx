import { useCartState } from '../../lib/cart-context';

export function CartIcon() {
  const items = useCartState();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <a
      href="/cart/"
      className="cart-icon-link"
      aria-label={`Shopping cart with ${totalItems} items`}
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
          <span className="cart-badge" aria-label={`${totalItems} items in cart`}>
            {totalItems}
          </span>
        )}
      </div>
      <style>{`
        .cart-icon-link {
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          color: white;
          /* Minimum 44x44px tap target */
          min-width: 44px;
          min-height: 44px;
          padding: 0.5rem;
          border-radius: 6px;
          transition: background 0.2s;
        }

        .cart-icon-link:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .cart-icon-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cart-icon-svg {
          width: 24px;
          height: 24px;
        }

        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #d4a574;
          color: #4a3728;
          font-size: 0.75rem;
          font-weight: 600;
          line-height: 1;
          padding: 0.25rem 0.4rem;
          border-radius: 10px;
          min-width: 20px;
          text-align: center;
        }
      `}</style>
    </a>
  );
}
