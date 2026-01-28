import { useCartActions } from '@/lib/cart-context';
import type { Meal } from '@/schemas/meal.schema';
import { toast } from 'sonner';

interface MealCardProps {
  meal: Meal;
}

export function MealCard({ meal }: MealCardProps) {
  const { addItem } = useCartActions();

  const handleAddToCart = () => {
    addItem({
      id: meal.id,
      name: meal.name,
      price: meal.price,
      quantity: 1,
      type: 'meal',
      imageUrl: meal.imageUrl
    });
    toast.success(`${meal.name} added to cart`);
  };

  return (
    <>
      <div className="meal-card">
        <div className="meal-image">
          {meal.imageUrl ? (
            <img src={meal.imageUrl} alt={meal.name} loading="lazy" />
          ) : (
            <div className="image-placeholder">No image</div>
          )}
          {meal.weekOf && (
            <div className="week-badge">
              <span className="badge-icon">✨</span>
              This Week's Special
            </div>
          )}
        </div>

        <div className="meal-info">
          <h3 className="meal-name">{meal.name}</h3>
          <div className="meal-meta">
            <p className="meal-price">R{meal.price.toFixed(2)}</p>
            {meal.servings && (
              <p className="meal-servings">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 7c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zM8 9c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z" fill="currentColor"/>
                </svg>
                {meal.servings}
              </p>
            )}
          </div>
          <p className="meal-description">{meal.description}</p>

          {meal.dietary.length > 0 && (
            <div className="dietary-badges">
              {meal.dietary.map(tag => (
                <span key={tag} className="dietary-badge">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            aria-label={`Add ${meal.name} to cart`}
          >
            Add Family Meal to Cart
          </button>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Karla:wght@400;500;600;700&display=swap');

        .meal-card {
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

        .meal-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(139, 90, 60, 0.2);
          border-color: #d4a574;
        }

        .meal-image {
          width: 100%;
          height: 240px;
          overflow: hidden;
          background: linear-gradient(135deg, #f8f4ef 0%, #e8ddd0 100%);
          position: relative;
        }

        .meal-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .meal-card:hover .meal-image img {
          transform: scale(1.05);
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

        .week-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: linear-gradient(135deg, #d4a574 0%, #8b5a3c 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 24px;
          font-family: 'Karla', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 0.375rem;
          box-shadow: 0 4px 12px rgba(139, 90, 60, 0.3);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 12px rgba(139, 90, 60, 0.3);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 6px 16px rgba(139, 90, 60, 0.4);
          }
        }

        .badge-icon {
          font-size: 1rem;
          animation: sparkle 1.5s ease-in-out infinite;
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 1;
            transform: rotate(0deg) scale(1);
          }
          50% {
            opacity: 0.7;
            transform: rotate(20deg) scale(1.1);
          }
        }

        .meal-info {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .meal-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.375rem;
          font-weight: 700;
          color: #4a3728;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }

        .meal-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid rgba(139, 90, 60, 0.1);
        }

        .meal-price {
          font-family: 'Playfair Display', serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: #8b5a3c;
        }

        .meal-servings {
          font-family: 'Karla', sans-serif;
          font-size: 0.875rem;
          color: #8b7355;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          background: rgba(139, 90, 60, 0.08);
          border-radius: 12px;
        }

        .meal-servings svg {
          flex-shrink: 0;
        }

        .meal-description {
          font-family: 'Karla', sans-serif;
          font-size: 0.95rem;
          color: #6b5a4c;
          line-height: 1.7;
          margin-bottom: 1rem;
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
          min-height: 52px;
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, #8b5a3c 0%, #6b4423 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-family: 'Karla', sans-serif;
          font-size: 1rem;
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
          box-shadow: 0 6px 16px rgba(139, 90, 60, 0.4);
        }

        .add-to-cart-btn:active {
          transform: translateY(0);
        }

        @media (max-width: 640px) {
          .meal-image {
            height: 200px;
          }

          .meal-info {
            padding: 1.25rem;
          }

          .meal-name {
            font-size: 1.25rem;
          }

          .meal-price {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}
