import { useState } from 'react';
import { ProductTabs } from './ProductTabs';
import { PlatterBuilder } from './PlatterBuilder';
import type { Product } from '@/schemas/product.schema';
import type { Meal } from '@/schemas/meal.schema';

interface HomePageProps {
  products: Product[];
  meals: Meal[];
}

export default function HomePage({ products, meals }: HomePageProps) {
  const [selectedItems, setSelectedItems] = useState<Product[]>([]);

  const handleSelectItem = (product: Product) => {
    if (selectedItems.length < 6) {
      setSelectedItems([...selectedItems, product]);
    }
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleClearPlatter = () => {
    setSelectedItems([]);
  };

  return (
    <>
      {/* Hero Section with Platter Builder */}
      <section className="hero-platter">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Build Your
              <span className="hero-title-accent"> Perfect Platter</span>
            </h1>
            <p className="hero-subtitle">
              Choose 6 delicious South African treats to create your custom homemade platter.
              Each platter is lovingly prepared in Pretoria North.
            </p>
            <div className="platter-pricing">
              <div className="pricing-card">
                <span className="pricing-label">Base Platter (6 items)</span>
                <span className="pricing-amount">R180</span>
              </div>
              <div className="pricing-note">
                Mix & match from our selection below
              </div>
            </div>
          </div>

          <PlatterBuilder
            selectedItems={selectedItems}
            onRemoveItem={handleRemoveItem}
            onClearPlatter={handleClearPlatter}
          />
        </div>
      </section>

      {/* Platter Items Selection */}
      <section className="platter-selection">
        <div className="section-header">
          <h2 className="section-title">Select Your Platter Items</h2>
          <p className="section-subtitle">
            Choose {6 - selectedItems.length} {selectedItems.length === 5 ? 'more item' : 'more items'} to complete your platter
          </p>
          <div className="selection-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(selectedItems.length / 6) * 100}%` }}
              />
            </div>
            <span className="progress-text">{selectedItems.length} / 6 items selected</span>
          </div>
        </div>

        <ProductTabs
          products={products}
          meals={meals}
          onSelectItem={handleSelectItem}
          selectedItems={selectedItems}
          isPlatterMode={true}
        />
      </section>

      {/* Weekly Prepared Meals */}
      <section className="meals-section">
        <div className="section-header meals-header">
          <h2 className="section-title">This Week's Prepared Meals</h2>
          <p className="section-subtitle">
            Don't want to build? Grab one of our ready-made family meals instead.
          </p>
        </div>

        <ProductTabs
          products={[]}
          meals={meals}
          defaultTab="meals"
          showProductsTab={false}
        />
      </section>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Karla:wght@400;500;600;700&display=swap');

        /* Hero Section */
        .hero-platter {
          background: linear-gradient(135deg, #e8d5c4 0%, #f4e9dd 50%, #d4b5a0 100%);
          position: relative;
          overflow: hidden;
          padding: 4rem 1.5rem 6rem;
        }

        .hero-platter::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image:
            radial-gradient(circle at 20% 30%, rgba(139, 90, 60, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(212, 165, 116, 0.08) 0%, transparent 50%);
          pointer-events: none;
        }

        .hero-platter::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238b5a3c' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.4;
          pointer-events: none;
        }

        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          position: relative;
          z-index: 1;
        }

        @media (min-width: 968px) {
          .hero-content {
            grid-template-columns: 1fr 1fr;
            align-items: center;
            gap: 4rem;
          }
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          line-height: 1.1;
          color: #4a3728;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .hero-title-accent {
          display: block;
          color: #8b5a3c;
          font-style: italic;
          position: relative;
        }

        .hero-title-accent::after {
          content: '';
          position: absolute;
          bottom: 0.1em;
          left: 0;
          right: 0;
          height: 0.15em;
          background: linear-gradient(90deg, #d4a574 0%, #8b5a3c 100%);
          opacity: 0.3;
          transform: skewY(-1deg);
        }

        .hero-subtitle {
          font-family: 'Karla', sans-serif;
          font-size: 1.125rem;
          line-height: 1.7;
          color: #6b5a4c;
          margin-bottom: 2.5rem;
          max-width: 540px;
        }

        .platter-pricing {
          background: rgba(255, 255, 255, 0.7);
          border: 2px solid #d4a574;
          border-radius: 16px;
          padding: 1.5rem;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 16px rgba(139, 90, 60, 0.1);
        }

        .pricing-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .pricing-label {
          font-family: 'Karla', sans-serif;
          font-weight: 600;
          color: #4a3728;
          font-size: 1rem;
        }

        .pricing-amount {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          color: #8b5a3c;
        }

        .pricing-note {
          font-family: 'Karla', sans-serif;
          font-size: 0.875rem;
          color: #8b7355;
          font-style: italic;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(139, 90, 60, 0.2);
        }

        /* Selection Section */
        .platter-selection {
          background: #ffffff;
          padding: 5rem 1.5rem;
          position: relative;
        }

        .platter-selection::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: linear-gradient(180deg, #e8d5c4 0%, #ffffff 100%);
        }

        .section-header {
          max-width: 1200px;
          margin: 0 auto 3rem;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          color: #4a3728;
          margin-bottom: 1rem;
        }

        .section-subtitle {
          font-family: 'Karla', sans-serif;
          font-size: 1.125rem;
          color: #8b7355;
          margin-bottom: 2rem;
        }

        .selection-progress {
          max-width: 400px;
          margin: 0 auto;
        }

        .progress-bar {
          height: 12px;
          background: rgba(139, 90, 60, 0.1);
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 0.75rem;
          position: relative;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #8b5a3c 0%, #d4a574 100%);
          border-radius: 12px;
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .progress-text {
          font-family: 'Karla', sans-serif;
          font-weight: 600;
          color: #8b5a3c;
          font-size: 0.875rem;
          display: block;
          text-align: center;
        }

        /* Meals Section */
        .meals-section {
          background: linear-gradient(135deg, #f4e9dd 0%, #e8d5c4 100%);
          padding: 5rem 1.5rem;
          position: relative;
        }

        .meals-header {
          padding-bottom: 1rem;
          border-bottom: 3px solid rgba(139, 90, 60, 0.2);
        }

        @media (max-width: 640px) {
          .hero-platter {
            padding: 3rem 1.5rem 4rem;
          }

          .hero-title {
            font-size: 2.25rem;
          }

          .pricing-amount {
            font-size: 1.75rem;
          }

          .platter-selection,
          .meals-section {
            padding: 3rem 1.5rem;
          }
        }
      `}</style>
    </>
  );
}
