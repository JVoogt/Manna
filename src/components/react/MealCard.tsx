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
    <div className="meal-card">
      <div className="meal-image">
        {meal.imageUrl ? (
          <img src={meal.imageUrl} alt={meal.name} loading="lazy" />
        ) : (
          <div className="image-placeholder">No image</div>
        )}
        {meal.weekOf && (
          <div className="week-badge">This Week's Special</div>
        )}
      </div>

      <div className="meal-info">
        <h3 className="meal-name">{meal.name}</h3>
        <div className="meal-meta">
          <p className="meal-price">R{meal.price.toFixed(2)}</p>
          {meal.servings && <p className="meal-servings">{meal.servings}</p>}
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
          Add to Cart
        </button>
      </div>
    </div>
  );
}
