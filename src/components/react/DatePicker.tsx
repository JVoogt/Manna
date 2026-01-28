import React from 'react';
import { DayPicker } from 'react-day-picker';
import { getMinimumPickupDate, SA_HOLIDAYS_2026 } from '../../lib/date-utils';
import 'react-day-picker/style.css';

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  error?: string;
}

export function DatePicker({ value, onChange, error }: DatePickerProps) {
  // Calculate minimum pickup date (2 business days ahead)
  const minDate = getMinimumPickupDate();

  // Disable weekends, dates before minimum, and SA public holidays
  const disabledDates = [
    { dayOfWeek: [0, 6] },  // Weekends (Sunday=0, Saturday=6)
    { before: minDate },     // Past dates and dates within 48 hours
    ...SA_HOLIDAYS_2026.map(holiday => ({ from: holiday, to: holiday }))
  ];

  return (
    <div className="date-picker">
      <DayPicker
        mode="single"
        selected={value}
        onSelect={onChange}
        disabled={disabledDates}
        className="date-picker__calendar"
      />
      <p className="date-picker__help">
        Orders require 48 hours notice (excluding weekends and public holidays)
      </p>
      {error && (
        <p className="date-picker__error">{error}</p>
      )}

      <style>{`
        .date-picker {
          margin-bottom: 1rem;
        }

        .date-picker__calendar {
          --rdp-accent-color: var(--color-primary, #8b5a3c);
          --rdp-background-color: rgba(139, 90, 60, 0.1);
          --rdp-accent-color-dark: var(--color-text-dark, #6b4423);
          --rdp-font-family: inherit;

          background: white;
          border: 1px solid var(--color-border, #e5e5e5);
          border-radius: 8px;
          padding: 1rem;
        }

        .date-picker__help {
          font-size: 0.875rem;
          color: var(--color-text-light, #666);
          margin: 0.5rem 0 0 0;
          font-style: italic;
        }

        .date-picker__error {
          font-size: 0.875rem;
          color: #dc2626;
          margin: 0.5rem 0 0 0;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
