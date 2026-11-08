import { getMeals } from './content';

/**
 * Combo rule: every full set of COMBO_SIZE meals in an order is sold at a rounded price, about
 * COMBO_PERCENT off the normal price (R275 of meals becomes R250). Puddings do not count.
 */
export const COMBO_SIZE = 5;
const COMBO_PERCENT = 10;
const ROUND_TO = 10;

export interface Priced {
  id: string;
  price: number;
  quantity: number;
}

export interface CartPricing {
  subtotal: number;
  discount: number;
  total: number;
  /** Number of meals (not puddings) in the order */
  mealCount: number;
  /** Number of complete combos earning the discount */
  combos: number;
  /** Meals still needed to complete the next combo (COMBO_SIZE when the order has none in progress) */
  toNextCombo: number;
}

const cents = (n: number) => Math.round(n * 100) / 100;

/** Price of one full set whose meals normally cost `base`: 10% off, rounded to the nearest R10, never above `base`. */
export function comboSetPrice(base: number): number {
  return Math.min(base, Math.round((base * (1 - COMBO_PERCENT / 100)) / ROUND_TO) * ROUND_TO);
}

/**
 * One place that prices an order, used by the home page, cart, checkout and the WhatsApp message
 * so the totals can never disagree. Sets are made from the cheapest meals first.
 */
export function priceCart(items: Priced[]): CartPricing {
  const category = new Map(getMeals().map((m) => [m.id, m.category]));
  const subtotal = cents(items.reduce((sum, i) => sum + i.price * i.quantity, 0));

  const mealUnits: number[] = [];
  for (const i of items) {
    if (category.get(i.id) === 'meal') {
      for (let n = 0; n < i.quantity; n++) mealUnits.push(i.price);
    }
  }
  mealUnits.sort((a, b) => a - b);

  const combos = Math.floor(mealUnits.length / COMBO_SIZE);
  let discount = 0;
  for (let c = 0; c < combos; c++) {
    const base = mealUnits.slice(c * COMBO_SIZE, (c + 1) * COMBO_SIZE).reduce((s, p) => s + p, 0);
    discount += base - comboSetPrice(base);
  }
  discount = cents(discount);

  return {
    subtotal,
    discount,
    total: cents(subtotal - discount),
    mealCount: mealUnits.length,
    combos,
    toNextCombo: COMBO_SIZE - (mealUnits.length % COMBO_SIZE),
  };
}

/** The combo as the menu advertises it: set price vs normal, when every meal costs the same, else null. */
export function comboOffer(): { full: number; combo: number } | null {
  const prices = getMeals().filter((m) => m.category === 'meal').map((m) => m.price);
  if (prices.length === 0 || prices.some((p) => p !== prices[0])) return null;
  const full = prices[0] * COMBO_SIZE;
  return { full, combo: comboSetPrice(full) };
}
