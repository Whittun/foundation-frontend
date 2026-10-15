import type { Task } from '@/features/TaskBoard';
import type { CreateTask, EditTask } from '@/features/TaskBoard/model/types';
import { baseApi } from '@/shared/api';

const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      query: () => '/tasks',
      providesTags: ['Tasks'],
    }),

    editTask: builder.mutation<{ updated: boolean }, { id: number; task: EditTask }>({
      query: ({ id, task }) => ({
        url: `/tasks/${id}`,
        method: 'PATCH',
        body: task,
      }),
      invalidatesTags: ['Tasks'],
    }),

    createTask: builder.mutation<{ created: boolean }, CreateTask>({
      query: (task) => ({
        url: '/tasks',
        method: 'POST',
        body: task,
      }),
      invalidatesTags: ['Tasks'],
    }),

    removeTask: builder.mutation<{ deleted: boolean }, { id: number }>({
      query: ({ id }) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tasks'],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useEditTaskMutation,
  useRemoveTaskMutation,
} = taskApi;
