import { productsSchema, type Product } from '../schemas/product.schema';
import { mealsSchema, type Meal } from '../schemas/meal.schema';
import productsData from '../content/products.json';
import mealsData from '../content/meals.json';

// Validate at module load time (build time for Astro static)
// If validation fails, build fails with clear error message
export const products: Product[] = productsSchema.parse(productsData);
export const meals: Meal[] = mealsSchema.parse(mealsData);

// Helper functions for common queries
export function getProducts(): Product[] {
  return products.filter(p => p.available);
}

export function getMeals(): Meal[] {
  return meals.filter(m => m.available);
}

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getProductsByCategory(category: Product['category']): Product[] {
  return products.filter(p => p.available && p.category === category);
}
