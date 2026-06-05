import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  CreateHabitLevelArgs,
  Habit,
  HabitLevel,
  UpdateHabitLevelArgs,
} from '../types/habitsTypes';

export const habitsApi = createApi({
  reducerPath: 'habitsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/habits',
    credentials: 'include',
  }),

  tagTypes: ['Habits', 'HabitLevels'],

  endpoints: (builder) => ({
    getAllHabits: builder.query<Habit[], void>({
      query: () => ({
        url: '',
      }),
      providesTags: ['Habits'],
    }),
    updateHabit: builder.mutation<Habit, { habitId: number; name: string }>({
      query: ({ habitId, name }) => ({
        url: `/${habitId}`,
        method: 'PATCH',
        body: {
          name,
        },
      }),
      invalidatesTags: ['Habits'],
    }),
    createHabit: builder.mutation<Habit, { name: string }>({
      query: ({ name }) => ({
        url: ``,
        method: 'POST',
        body: {
          name,
        },
      }),
      invalidatesTags: ['Habits'],
    }),
    deleteHabit: builder.mutation<{ deleted: boolean }, { habitId: number }>({
      query: ({ habitId }) => ({
        url: `/${habitId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Habits'],
    }),
    getHabitLevelsByHabit: builder.query<HabitLevel[], { habitId: number }>({
      query: ({ habitId }) => ({
        url: `/${habitId}/levels`,
      }),
      providesTags: ['HabitLevels'],
    }),
    updateHabitLevel: builder.mutation<HabitLevel, UpdateHabitLevelArgs>({
      query: ({ habitLevelId, ...body }) => ({
        url: `/levels/${habitLevelId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['HabitLevels'],
    }),
    createHabitLevel: builder.mutation<HabitLevel, CreateHabitLevelArgs>({
      query: ({ habitId, ...body }) => ({
        url: `/${habitId}/levels`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['HabitLevels'],
    }),

    deleteHabitLevel: builder.mutation<{ deleted: boolean }, { habitLevelId: number }>({
      query: ({ habitLevelId }) => ({
        url: `/levels/${habitLevelId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['HabitLevels'],
    }),
  }),
});

export const {
  useGetAllHabitsQuery,
  useUpdateHabitMutation,
  useCreateHabitMutation,
  useDeleteHabitMutation,
  useGetHabitLevelsByHabitQuery,
  useUpdateHabitLevelMutation,
  useCreateHabitLevelMutation,
  useDeleteHabitLevelMutation,
} = habitsApi;
