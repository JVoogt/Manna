import { z } from 'zod';

export const productSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  price: z.number().positive(),
  category: z.enum(['snack', 'sweet', 'savory']),
  imageUrl: z.string().url().optional(),
  dietary: z.array(z.enum(['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free'])).default([]),
  allergens: z.array(z.string()).default([]),
  available: z.boolean().default(true)
});

export const productsSchema = z.array(productSchema);
export type Product = z.infer<typeof productSchema>;
