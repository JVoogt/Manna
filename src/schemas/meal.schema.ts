import { z } from 'zod';

export const mealSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  price: z.number().positive(),
  category: z.enum(['meal', 'dessert']),
  imageUrl: z.string().url().optional(),
  servings: z.string().optional(), // e.g., "1 portion"
  dietary: z.array(z.enum(['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free'])).default([]),
  allergens: z.array(z.string()).default([]),
  available: z.boolean().default(true)
});

export const mealsSchema = z.array(mealSchema);
export type Meal = z.infer<typeof mealSchema>;
