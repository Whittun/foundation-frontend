import { baseApi } from '@/shared/api';
import type { ObjectivesGraph } from '../model/types';

const OBJECTIVES_URL = '/objectives';

export const objectivesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getObjectivesGraph: builder.query<ObjectivesGraph, void>({
      query: () => ({
        url: `${OBJECTIVES_URL}/graph`,
      }),
      providesTags: ['Objectives'],
    }),

    saveObjectivesGraph: builder.mutation<ObjectivesGraph, ObjectivesGraph>({
      query: (body) => ({
        url: `${OBJECTIVES_URL}/graph`,
        method: 'PUT',
        body,
      }),
    }),
  }),
});

export const { useGetObjectivesGraphQuery, useSaveObjectivesGraphMutation } = objectivesApi;
