import { useCartActions } from '@/lib/cart-context';
import type { Product } from '@/schemas/product.schema';
import { toast } from 'sonner';

interface PlatterBuilderProps {
  selectedItems: Product[];
  onRemoveItem: (index: number) => void;
  onClearPlatter: () => void;
}

export function PlatterBuilder({ selectedItems, onRemoveItem, onClearPlatter }: PlatterBuilderProps) {
  const { addItem } = useCartActions();

  const handleAddToCart = () => {
    if (selectedItems.length !== 6) {
      toast.error('Please select 6 items to complete your platter');
      return;
    }

    // Calculate total platter price
    const totalPlatterPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);
    const pricePerItem = totalPlatterPrice / 6;

    // Add platter as a bundle to cart with proportional pricing
    selectedItems.forEach(item => {
      addItem({
        id: item.id,
        name: item.name,
        price: pricePerItem, // Divide total platter price equally
        quantity: 1,
        type: 'product',
        imageUrl: item.imageUrl
      });
    });

    toast.success(`Platter added to cart! Total: R${totalPlatterPrice.toFixed(2)}`);
    onClearPlatter();
  };

  const slots = Array.from({ length: 6 }, (_, i) => selectedItems[i] || null);
  const isComplete = selectedItems.length === 6;

  return (
    <div className="platter-builder">
      <div className="platter-container">
        <div className="platter-grid">
          {slots.map((item, index) => (
            <div
              key={index}
              className={`platter-slot ${item ? 'filled' : 'empty'} ${isComplete && item ? 'complete' : ''}`}
            >
              {item ? (
                <>
                  <button
                    className="remove-btn"
                    onClick={() => onRemoveItem(index)}
                    aria-label={`Remove ${item.name}`}
                  >
                    ×
                  </button>
                  <div className="filled-slot">
                    <div className="slot-number-filled">{index + 1}</div>
                    <div className="slot-name">{item.name}</div>
                  </div>
                </>
              ) : (
                <div className="empty-slot">
                  <div className="slot-number">{index + 1}</div>
                  <div className="slot-placeholder">Empty</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedItems.length > 0 && (
          <div className="platter-actions">
            <button className="clear-btn" onClick={onClearPlatter}>
              Clear All
            </button>
            <button
              className={`add-platter-btn ${isComplete ? 'ready' : 'disabled'}`}
              onClick={handleAddToCart}
              disabled={!isComplete}
            >
              {isComplete ? (
                <>
                  <span className="btn-icon">🛒</span>
                  Add Platter to Cart
                </>
              ) : (
                `Select ${6 - selectedItems.length} more item${6 - selectedItems.length !== 1 ? 's' : ''}`
              )}
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .platter-builder {
          position: relative;
        }

        .platter-container {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 24px;
          padding: 2rem;
          box-shadow:
            0 10px 40px rgba(139, 90, 60, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          border: 3px solid #d4a574;
          position: relative;
        }

        .platter-container::before {
          content: '';
          position: absolute;
          top: -3px;
          left: -3px;
          right: -3px;
          bottom: -3px;
          background: linear-gradient(135deg, #d4a574 0%, #8b5a3c 100%);
          border-radius: 24px;
          z-index: -1;
          opacity: 0.3;
          filter: blur(8px);
        }

        .platter-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        @media (max-width: 640px) {
          .platter-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .platter-slot {
          aspect-ratio: 1;
          border-radius: 16px;
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .platter-slot.empty {
          background: linear-gradient(135deg, #f8f4ef 0%, #e8ddd0 100%);
          border: 2px dashed #d4a574;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .platter-slot.filled {
          background: white;
          border: 2px solid #d4a574;
          animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .platter-slot.complete {
          animation: celebrate 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 16px rgba(139, 90, 60, 0.3);
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.8) rotate(-5deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes celebrate {
          0%, 100% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.05) rotate(2deg);
          }
          75% {
            transform: scale(1.05) rotate(-2deg);
          }
        }

        .empty-slot {
          text-align: center;
          color: #8b7355;
        }

        .slot-number {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          color: #d4a574;
          margin-bottom: 0.25rem;
        }

        .slot-placeholder {
          font-family: 'Karla', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .filled-slot {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          text-align: center;
          background: linear-gradient(135deg, #8b5a3c 0%, #6b4423 100%);
          position: relative;
          overflow: hidden;
        }

        .filled-slot::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
          animation: rotate 20s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .slot-number-filled {
          font-family: 'Playfair Display', serif;
          font-size: 3rem;
          font-weight: 700;
          color: #d4a574;
          margin-bottom: 0.5rem;
          position: relative;
          z-index: 1;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          line-height: 1;
        }

        .slot-name {
          font-family: 'Karla', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          color: #f8f4ef;
          position: relative;
          z-index: 1;
          line-height: 1.3;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
        }

        .remove-btn {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(139, 90, 60, 0.9);
          color: white;
          border: 2px solid white;
          font-size: 1.25rem;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .remove-btn:hover {
          background: #6b4423;
          transform: scale(1.1);
        }

        .platter-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
          justify-content: space-between;
        }

        @media (max-width: 640px) {
          .platter-actions {
            flex-direction: column;
          }
        }

        .clear-btn {
          font-family: 'Karla', sans-serif;
          padding: 0.75rem 1.5rem;
          background: transparent;
          border: 2px solid #d4a574;
          color: #8b5a3c;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .clear-btn:hover {
          background: #d4a574;
          color: white;
        }

        .add-platter-btn {
          font-family: 'Karla', sans-serif;
          flex: 1;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #8b5a3c 0%, #6b4423 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          min-height: 56px;
          box-shadow: 0 4px 16px rgba(139, 90, 60, 0.3);
          position: relative;
          overflow: hidden;
        }

        .add-platter-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .add-platter-btn.ready:hover::before {
          left: 100%;
        }

        .add-platter-btn.ready:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 90, 60, 0.4);
        }

        .add-platter-btn.ready:active {
          transform: translateY(0);
        }

        .add-platter-btn.disabled {
          background: rgba(139, 90, 60, 0.3);
          cursor: not-allowed;
          box-shadow: none;
        }

        .btn-icon {
          font-size: 1.25rem;
          animation: bounce 1s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @media (max-width: 640px) {
          .platter-container {
            padding: 1.5rem;
          }

          .clear-btn,
          .add-platter-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
