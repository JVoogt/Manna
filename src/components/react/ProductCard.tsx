import { useCartActions } from '@/lib/cart-context';
import type { Product } from '@/schemas/product.schema';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
  isSelected?: boolean;
  isDisabled?: boolean;
}

export function ProductCard({ product, onSelect, isSelected = false, isDisabled = false }: ProductCardProps) {
  const { addItem } = useCartActions();

  const handleClick = () => {
    if (onSelect) {
      if (isDisabled && !isSelected) {
        toast.error('Platter is full! Remove an item first.');
        return;
      }
      onSelect(product);
      if (isSelected) {
        toast.success(`${product.name} removed from platter`);
      } else {
        toast.success(`${product.name} added to platter`);
      }
    } else {
      // Regular cart mode
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        type: 'product',
        imageUrl: product.imageUrl
      });
      toast.success(`${product.name} added to cart`);
    }
  };

  return (
    <>
      <div className={`product-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}>
        <div className="product-image">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} loading="lazy" />
          ) : (
            <div className="image-placeholder">No image</div>
          )}
          {isSelected && (
            <div className="selected-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#8b5a3c"/>
                <path d="M7 12l3 3 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </div>

        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">
            {onSelect ? 'Part of platter' : `R${product.price.toFixed(2)}`}
          </p>
          <p className="product-description">{product.description}</p>

          {product.dietary.length > 0 && (
            <div className="dietary-badges">
              {product.dietary.map(tag => (
                <span key={tag} className="dietary-badge">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <button
            className="add-to-cart-btn"
            onClick={handleClick}
            disabled={isDisabled && !isSelected}
            aria-label={onSelect ? (isSelected ? `Remove ${product.name} from platter` : `Select ${product.name} for platter`) : `Add ${product.name} to cart`}
          >
            {isSelected ? '✓ Selected (Click to Remove)' : onSelect ? 'Select for Platter' : 'Add to Cart'}
          </button>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Karla:wght@400;500;600;700&display=swap');

        .product-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          border: 2px solid transparent;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          position: relative;
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(139, 90, 60, 0.2);
          border-color: #d4a574;
        }

        .product-card.selected {
          border-color: #8b5a3c;
          box-shadow: 0 8px 24px rgba(139, 90, 60, 0.3);
          background: linear-gradient(135deg, #ffffff 0%, #faf7f4 100%);
        }

        .product-card.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .product-card.disabled:hover {
          transform: none;
          border-color: transparent;
        }

        .product-image {
          width: 100%;
          height: 220px;
          overflow: hidden;
          background: linear-gradient(135deg, #f8f4ef 0%, #e8ddd0 100%);
          position: relative;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .product-card:hover .product-image img {
          transform: scale(1.05);
        }

        .selected-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          animation: popIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
        }

        @keyframes popIn {
          from {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          to {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        .image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8b7355;
          font-family: 'Karla', sans-serif;
          font-size: 0.875rem;
        }

        .product-info {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .product-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #4a3728;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }

        .product-price {
          font-family: 'Karla', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          color: #8b5a3c;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .product-description {
          font-family: 'Karla', sans-serif;
          font-size: 0.9rem;
          color: #6b5a4c;
          line-height: 1.6;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dietary-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .dietary-badge {
          background: linear-gradient(135deg, #e8d5c4 0%, #d4b5a0 100%);
          color: #6b4423;
          padding: 0.25rem 0.75rem;
          border-radius: 16px;
          font-family: 'Karla', sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .add-to-cart-btn {
          width: 100%;
          min-height: 48px;
          padding: 0.875rem 1.5rem;
          background: linear-gradient(135deg, #8b5a3c 0%, #6b4423 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-family: 'Karla', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: auto;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          position: relative;
          overflow: hidden;
        }

        .add-to-cart-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .add-to-cart-btn:hover::before {
          left: 100%;
        }

        .add-to-cart-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 90, 60, 0.4);
        }

        .add-to-cart-btn:active {
          transform: translateY(0);
        }

        .product-card.selected .add-to-cart-btn {
          background: linear-gradient(135deg, #d4a574 0%, #8b5a3c 100%);
        }

        .add-to-cart-btn:disabled {
          background: rgba(139, 90, 60, 0.3);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .add-to-cart-btn:disabled:hover {
          transform: none;
        }

        @media (max-width: 640px) {
          .product-image {
            height: 180px;
          }

          .product-info {
            padding: 1.25rem;
          }

          .product-name {
            font-size: 1.125rem;
          }
        }
      `}</style>
    </>
  );
}
