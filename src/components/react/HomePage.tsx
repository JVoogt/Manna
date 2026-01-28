import { ProductTabs } from './ProductTabs';
import type { Product } from '@/schemas/product.schema';
import type { Meal } from '@/schemas/meal.schema';

interface HomePageProps {
  products: Product[];
  meals: Meal[];
}

export default function HomePage({ products, meals }: HomePageProps) {
  return (
    <>
      <section className="hero">
        <h1>Manna Kitchen</h1>
        <p>Fresh homemade platters and weekly meals</p>
      </section>

      <section className="menu-section">
        <h2>Browse Our Menu</h2>
        <ProductTabs products={products} meals={meals} />
      </section>

      <section className="platter-builder-note">
        <p className="coming-soon-note">
          <strong>Custom Platters:</strong> Build your perfect platter with your favorite items. Coming in Phase 3!
        </p>
      </section>
    </>
  );
}
