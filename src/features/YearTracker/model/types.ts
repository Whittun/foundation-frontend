export type DayRating = 1 | 2 | 3 | 4 | 5;
export type YearMap = Record<string, DayRating | null>;
export type DayRatingData = {
  id: number;
  userId: number;
  date: string;
  rating: DayRating;
};

export type CalendarDay = string | null;
export type Month = CalendarDay[];
export type Months = Month[];
