import { z } from 'zod';
import { parsePhoneNumber } from 'libphonenumber-js';
import { isBusinessDay, getMinimumPickupDate } from './date-utils';

/**
 * Checkout form validation schema
 * - Name: minimum 2 characters
 * - Phone: SA format, normalized to E.164 (+27XXXXXXXXX)
 * - Pickup date: must be business day at least 2 business days in advance
 * - Notes: optional
 */
export const checkoutSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),

  phone: z.string().refine((val) => {
    try {
      const parsed = parsePhoneNumber(val, 'ZA');
      return parsed?.isValid() ?? false;
    } catch {
      return false;
    }
  }, 'Invalid South African phone number').transform((val) => {
    const parsed = parsePhoneNumber(val, 'ZA');
    return parsed!.format('E.164');
  }),

  pickupDate: z.date().refine((date) => {
    // Must be a business day (not weekend/holiday)
    if (!isBusinessDay(date)) {
      return false;
    }

    // Must be at least 2 business days in advance
    const minDate = getMinimumPickupDate();
    return date >= minDate;
  }, 'Pickup must be at least 2 business days in advance (excluding weekends and holidays)'),

  notes: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
