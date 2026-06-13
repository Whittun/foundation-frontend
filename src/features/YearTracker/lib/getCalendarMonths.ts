import type { Months, YearMap } from '../model/types';

export const getCalendarMonths = (data: YearMap): Months => {
  const dates = Object.keys(data);
  const months: Months = Array.from({ length: 12 }).map(() => []);

  dates.forEach((date) => {
    const [, month] = date.split('-');

    const numIndexMonth = Number(month) - 1;

    const weekIndex = (new Date(date).getDay() + 6) % 7;

    if (months[numIndexMonth].length === 0) {
      const monthOffset = Array.from({ length: weekIndex }).map(() => null);
      months[numIndexMonth].push(...monthOffset);
    }

    months[numIndexMonth].push(date);
  });

  return months;
};
