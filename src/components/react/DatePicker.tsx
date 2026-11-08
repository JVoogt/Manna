import React from 'react';
import { DayPicker } from 'react-day-picker';
import { getMinimumPickupDate, SA_HOLIDAYS } from '../../lib/date-utils';
import 'react-day-picker/style.css';
import '../../styles/date-picker.css';

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  error?: string;
  /** id of the element that holds this picker's error, for aria-describedby */
  errorId?: string;
}

export function DatePicker({ value, onChange, error, errorId = 'preferred-date-error' }: DatePickerProps) {
  // Calculate the earliest preferred date (2 business days ahead)
  const minDate = getMinimumPickupDate();

  // Disable weekends, dates before minimum, and SA public holidays
  const disabledDates = [
    { dayOfWeek: [0, 6] },  // Weekends (Sunday=0, Saturday=6)
    { before: minDate },     // Past dates and dates inside the notice period
    ...SA_HOLIDAYS.map(holiday => ({ from: holiday, to: holiday }))
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
        We need at least 2 business days' notice. Weekends and public holidays do not count.
      </p>
      {value && (
        <p className="date-picker__chosen" role="status">
          Chosen: {value.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      )}
      {error && (
        <p className="date-picker__error" id={errorId} role="alert">{error}</p>
      )}

    </div>
  );
}
