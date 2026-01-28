import { isWeekend, format, addDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

const SA_TIMEZONE = 'Africa/Johannesburg';

// South Africa public holidays 2026 (10 working days)
export const SA_HOLIDAYS_2026 = [
  new Date('2026-01-01'), // New Year's Day
  new Date('2026-04-03'), // Good Friday
  new Date('2026-04-06'), // Family Day
  new Date('2026-04-27'), // Freedom Day
  new Date('2026-05-01'), // Workers' Day
  new Date('2026-06-16'), // Youth Day
  new Date('2026-08-10'), // National Women's Day observed (Mon)
  new Date('2026-09-24'), // Heritage Day
  new Date('2026-12-16'), // Day of Reconciliation
  new Date('2026-12-25'), // Christmas Day
];

/**
 * Check if a date is a business day (not weekend or public holiday)
 */
export function isBusinessDay(date: Date): boolean {
  if (isWeekend(date)) return false;

  // Check against public holidays
  const dateStr = format(date, 'yyyy-MM-dd');
  return !SA_HOLIDAYS_2026.some(holiday =>
    format(holiday, 'yyyy-MM-dd') === dateStr
  );
}

/**
 * Calculate minimum pickup date (2 business days from now)
 * Requirement: 48 hours notice excluding weekends and holidays
 */
export function getMinimumPickupDate(): Date {
  let date = new Date();
  let businessDaysAdded = 0;

  while (businessDaysAdded < 2) {
    date = addDays(date, 1);
    if (isBusinessDay(date)) {
      businessDaysAdded++;
    }
  }

  return date;
}

/**
 * Format date in South African Standard Time (SAST)
 * Default format: "Thursday, 30 January 2026"
 */
export function formatSAST(date: Date, formatStr: string = 'EEEE, d MMMM yyyy'): string {
  return formatInTimeZone(date, SA_TIMEZONE, formatStr);
}
