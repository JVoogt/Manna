import { isWeekend, format, addDays, startOfDay } from 'date-fns';

// South African public holidays, 2026 and 2027 (10 working days each).
// 2027 dates: verify against the government gazette before relying on them.
// Add 2028 before orders for January 2028 (a dev-only warning fires 60 days before the list runs out).
// Built as LOCAL dates (not new Date('YYYY-MM-DD'), which is UTC midnight) so the
// calendar day is the same in every timezone the browser might report.
function localDate(ymd: string): Date {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export const SA_HOLIDAYS: Date[] = [
  '2026-01-01', // New Year's Day
  '2026-04-03', // Good Friday
  '2026-04-06', // Family Day
  '2026-04-27', // Freedom Day
  '2026-05-01', // Workers' Day
  '2026-06-16', // Youth Day
  '2026-08-10', // National Women's Day observed (Mon)
  '2026-09-24', // Heritage Day
  '2026-12-16', // Day of Reconciliation
  '2026-12-25', // Christmas Day
  '2027-01-01', // New Year's Day
  '2027-03-22', // Human Rights Day
  '2027-03-26', // Good Friday
  '2027-03-29', // Family Day
  '2027-04-27', // Freedom Day
  '2027-06-16', // Youth Day
  '2027-08-09', // National Women's Day
  '2027-09-24', // Heritage Day
  '2027-12-16', // Day of Reconciliation
  '2027-12-27', // Day of Goodwill observed (Mon)
].map(localDate);

const HOLIDAY_KEYS = new Set(SA_HOLIDAYS.map(h => format(h, 'yyyy-MM-dd')));

// Dev-only reminder: the holiday list is about to run out.
if ((import.meta as { env?: { DEV?: boolean } }).env?.DEV) {
  const last = SA_HOLIDAYS[SA_HOLIDAYS.length - 1];
  if (last.getTime() - Date.now() < 60 * 24 * 60 * 60 * 1000) {
    console.warn('SA_HOLIDAYS ends on ' + format(last, 'yyyy-MM-dd') + ': add the next year.');
  }
}

/**
 * Check if a date is a business day (not weekend or public holiday)
 */
export function isBusinessDay(date: Date): boolean {
  if (isWeekend(date)) return false;

  // Check against public holidays
  const dateStr = format(date, 'yyyy-MM-dd');
  return !HOLIDAY_KEYS.has(dateStr);
}

/**
 * Calculate the earliest preferred date (2 business days from now)
 * Requirement: 2 business days' notice, weekends and public holidays do not count.
 * Returned at the start of that day, so the day picker (which hands back midnight)
 * can select it and the validator accepts it.
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

  return startOfDay(date);
}

/**
 * Format the local calendar day of a Date (timezone-agnostic: no SAST shift).
 * The day picker returns local midnight, so the day the customer clicked is the
 * day printed, whatever timezone the browser reports.
 * Default format: "Thursday, 30 January 2026"
 */
export function formatLocalDate(date: Date, formatStr: string = 'EEEE, d MMMM yyyy'): string {
  return format(date, formatStr);
}
