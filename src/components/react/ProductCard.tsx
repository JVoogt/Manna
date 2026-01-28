import { useCartActions } from '@/lib/cart-context';
import type { Product } from '@/schemas/product.schema';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartActions();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      type: 'product',
      imageUrl: product.imageUrl
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} loading="lazy" />
        ) : (
          <div className="image-placeholder">No image</div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">R{product.price.toFixed(2)}</p>
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
          onClick={handleAddToCart}
          aria-label={`Add ${product.name} to cart`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
