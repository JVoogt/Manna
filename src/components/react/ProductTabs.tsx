import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import type { Product } from '@/schemas/product.schema';
import type { Meal } from '@/schemas/meal.schema';
import { ProductCard } from './ProductCard';
import { MealCard } from './MealCard';

interface ProductTabsProps {
  products: Product[];
  meals: Meal[];
}

export function ProductTabs({ products, meals }: ProductTabsProps) {
  return (
    <TabGroup>
      <TabList className="tab-list">
        <Tab className="tab">Products</Tab>
        <Tab className="tab">Weekly Meals</Tab>
      </TabList>

      <TabPanels className="tab-panels">
        <TabPanel className="tab-panel">
          <div className="product-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabPanel>

        <TabPanel className="tab-panel">
          <div className="product-grid">
            {meals.map(meal => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
