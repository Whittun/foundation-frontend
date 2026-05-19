import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { ObjectivesGraph } from '../types/objectivesTypes';

export const objectivesApi = createApi({
  reducerPath: 'objectivesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/objectives',
  }),

  tagTypes: ['Objectives'],

  endpoints: (builder) => ({
    getObjectivesGraph: builder.query<ObjectivesGraph, void>({
      query: () => ({
        url: '/graph',
      }),
      providesTags: ['Objectives'],
    }),

    saveObjectivesGraph: builder.mutation<ObjectivesGraph, ObjectivesGraph>({
      query: (body) => ({
        url: `/graph`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Objectives'],
    }),
  }),
});

export const { useGetObjectivesGraphQuery, useSaveObjectivesGraphMutation } = objectivesApi;
