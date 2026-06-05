import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { DayRating, DayRatingData, YearMap } from '../types/dayRatingsTypes';

export const dayRatingsApi = createApi({
  reducerPath: 'dayRatingsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000',
    credentials: 'include',
  }),

  tagTypes: ['YearRatings'],

  endpoints: (builder) => ({
    getYearRatings: builder.query<YearMap, number>({
      query: (year: number) => ({
        url: '/day-ratings',
        params: {
          year,
        },
      }),

      providesTags: ['YearRatings'],
    }),
    setDayRating: builder.mutation<DayRatingData, { date: string; rating: DayRating }>({
      query: ({ date, rating }) => ({
        url: '/day-ratings',
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
        url: '/day-ratings',
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
