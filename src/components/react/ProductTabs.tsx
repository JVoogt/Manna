import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import type { Product } from '@/schemas/product.schema';
import type { Meal } from '@/schemas/meal.schema';
import { ProductCard } from './ProductCard';
import { MealCard } from './MealCard';

interface ProductTabsProps {
  products: Product[];
  meals: Meal[];
  onSelectItem?: (product: Product) => void;
  selectedItems?: Product[];
  isPlatterMode?: boolean;
  defaultTab?: 'products' | 'meals';
  showProductsTab?: boolean;
}

export function ProductTabs({
  products,
  meals,
  onSelectItem,
  selectedItems = [],
  isPlatterMode = false,
  defaultTab = 'products',
  showProductsTab = true
}: ProductTabsProps) {
  const defaultIndex = defaultTab === 'meals' ? 1 : 0;

  const isItemSelected = (productId: string) => {
    return selectedItems.some(item => item.id === productId);
  };

  const canSelectMore = selectedItems.length < 6;

  return (
    <TabGroup defaultIndex={defaultIndex}>
      <TabList className="tab-list">
        {showProductsTab && <Tab className="tab">Platter Items</Tab>}
        <Tab className="tab">Weekly Meals</Tab>
      </TabList>

      <TabPanels className="tab-panels">
        {showProductsTab && (
          <TabPanel className="tab-panel">
            <div className="product-grid">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={isPlatterMode ? onSelectItem : undefined}
                  isSelected={isPlatterMode ? isItemSelected(product.id) : false}
                  isDisabled={isPlatterMode ? !canSelectMore && !isItemSelected(product.id) : false}
                />
              ))}
            </div>
          </TabPanel>
        )}

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
