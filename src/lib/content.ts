import { mealsSchema, type Meal } from '../schemas/meal.schema';
import mealsData from '../content/meals.json';

// Validate at module load time (build time for Astro static)
// If validation fails, build fails with clear error message
export const meals: Meal[] = mealsSchema.parse(mealsData);

export function getMeals(): Meal[] {
  return meals.filter(m => m.available);
}
