import { z } from 'zod';
import { parsePhoneNumber } from 'libphonenumber-js';
import { isBusinessDay, getMinimumPickupDate } from './date-utils';

export const FULFILMENT_OPTIONS = ['delivery', 'pickup'] as const;
export type Fulfilment = (typeof FULFILMENT_OPTIONS)[number];

/**
 * Checkout form validation schema
 * - Name: minimum 2 characters
 * - Phone: SA format, normalized to E.164 (+27XXXXXXXXX)
 * - Fulfilment: 'delivery' or 'pickup'; delivery needs an address
 * - Preferred date: must be a business day at least 2 business days in advance
 * - Notes: optional
 */
export const checkoutSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters'),

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

    fulfilment: z.enum(FULFILMENT_OPTIONS, {
      errorMap: () => ({ message: 'Please choose delivery or pickup' }),
    }),

    address: z.string().max(300, 'Address is too long (300 characters at most)').optional(),

    pickupDate: z
      .date({
        required_error: 'Please choose a date',
        invalid_type_error: 'Please choose a date',
      })
      .refine((date) => {
        // Must be a business day (not weekend/holiday)
        if (!isBusinessDay(date)) {
          return false;
        }

        // Must be at least 2 business days in advance
        const minDate = getMinimumPickupDate();
        return date >= minDate;
      }, 'Please choose a date at least 2 business days ahead (weekends and public holidays do not count)'),

    notes: z.string().max(500, 'Notes are too long (500 characters at most)').optional(),
  })
  .superRefine((data, ctx) => {
    if (data.fulfilment === 'delivery' && (data.address?.trim().length ?? 0) < 5) {
      ctx.addIssue({
        code: 'custom',
        path: ['address'],
        message: 'Please enter the address we should deliver to',
      });
    }
  });

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
