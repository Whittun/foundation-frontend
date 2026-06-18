import { baseApi } from '@/shared/api';
import type { CreateHabitLevelArgs, Habit, HabitLevel, UpdateHabitLevelArgs } from '../model/types';

const HABITS_URL = '/habits';

export const habitsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllHabits: builder.query<Habit[], void>({
      query: () => ({
        url: HABITS_URL,
      }),
      providesTags: ['Habits'],
    }),
    updateHabit: builder.mutation<Habit, { habitId: number; name: string }>({
      query: ({ habitId, name }) => ({
        url: `${HABITS_URL}/${habitId}`,
        method: 'PATCH',
        body: {
          name,
        },
      }),
      invalidatesTags: ['Habits'],
    }),
    createHabit: builder.mutation<Habit, { name: string }>({
      query: ({ name }) => ({
        url: HABITS_URL,
        method: 'POST',
        body: {
          name,
        },
      }),
      invalidatesTags: ['Habits'],
    }),
    deleteHabit: builder.mutation<{ deleted: boolean }, { habitId: number }>({
      query: ({ habitId }) => ({
        url: `${HABITS_URL}/${habitId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Habits'],
    }),
    getHabitLevelsByHabit: builder.query<HabitLevel[], { habitId: number }>({
      query: ({ habitId }) => ({
        url: `${HABITS_URL}/${habitId}/levels`,
      }),
      providesTags: ['HabitLevels'],
    }),
    updateHabitLevel: builder.mutation<HabitLevel, UpdateHabitLevelArgs>({
      query: ({ habitLevelId, ...body }) => ({
        url: `${HABITS_URL}/levels/${habitLevelId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['HabitLevels'],
    }),
    createHabitLevel: builder.mutation<HabitLevel, CreateHabitLevelArgs>({
      query: ({ habitId, ...body }) => ({
        url: `${HABITS_URL}/${habitId}/levels`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['HabitLevels'],
    }),

    deleteHabitLevel: builder.mutation<{ deleted: boolean }, { habitLevelId: number }>({
      query: ({ habitLevelId }) => ({
        url: `${HABITS_URL}/levels/${habitLevelId}`,
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
