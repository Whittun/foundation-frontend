import { baseApi } from '@/shared/api';
import type { DayRating, DayRatingData, YearMap } from '../model/types';

const DAY_RATING_URL = '/day-ratings';

export const dayRatingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getYearRatings: builder.query<YearMap, number>({
      query: (year: number) => ({
        url: DAY_RATING_URL,
        params: {
          year,
        },
      }),

      providesTags: ['YearRatings'],
    }),
    setDayRating: builder.mutation<DayRatingData, { date: string; rating: DayRating }>({
      query: ({ date, rating }) => ({
        url: DAY_RATING_URL,
        method: 'PATCH',
        body: {
          date,
          rating,
        },
      }),

      invalidatesTags: ['YearRatings'],
    }),
    deleteDayRating: builder.mutation<{ deleted: boolean }, { date: string }>({
      query: ({ date }) => ({
        url: DAY_RATING_URL,
        method: 'DELETE',
        body: {
          date,
        },
      }),
      invalidatesTags: ['YearRatings'],
    }),
  }),
});

export const { useGetYearRatingsQuery, useSetDayRatingMutation, useDeleteDayRatingMutation } =
  dayRatingsApi;
