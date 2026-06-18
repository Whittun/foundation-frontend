import { baseApi } from '@/shared/api';
import type { AuthRequest, AuthResponse } from '../model/authTypes';

const AUTH_URL = '/auth';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, AuthRequest>({
      query: (userData: AuthRequest) => ({
        url: `${AUTH_URL}/login`,
        method: 'POST',
        body: userData,
      }),
    }),
    register: builder.mutation<AuthResponse, AuthRequest>({
      query: (userData: AuthRequest) => ({
        url: `${AUTH_URL}/register`,
        method: 'POST',
        body: userData,
      }),
    }),
    me: builder.query<AuthResponse, void>({
      query: () => ({
        url: `${AUTH_URL}/me`,
      }),
    }),

    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: 'POST',
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useMeQuery, useLogoutMutation } = authApi;
