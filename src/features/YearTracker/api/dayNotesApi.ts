import { baseApi } from '@/shared/api';
import type { JSONContent } from '@tiptap/core';
import type { DayNoteData } from '../model/types';

const DAY_NOTES_URL = '/day-notes';

export const dayNotesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDayNote: builder.query<DayNoteData | null, string>({
      query: (date: string) => ({
        url: `${DAY_NOTES_URL}/${date}`,
      }),

      providesTags: (_result, _error, date) => [{ type: 'DayNotes', id: date }],
    }),
    setDayNote: builder.mutation<DayNoteData, { date: string; contentJson: JSONContent }>({
      query: ({ date, contentJson }) => ({
        url: `${DAY_NOTES_URL}/${date}`,
        method: 'PUT',
        body: {
          contentJson,
        },
      }),

      invalidatesTags: (_result, _error, { date }) => [{ type: 'DayNotes', id: date }],
    }),
    deleteDayNote: builder.mutation<{ deleted: boolean }, { date: string }>({
      query: ({ date }) => ({
        url: `${DAY_NOTES_URL}/${date}`,
        method: 'DELETE',
      }),

      invalidatesTags: (_result, _error, { date }) => [{ type: 'DayNotes', id: date }],
    }),
  }),
});

export const { useGetDayNoteQuery, useSetDayNoteMutation, useDeleteDayNoteMutation } = dayNotesApi;
