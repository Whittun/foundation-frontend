import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { AuthRequest, AuthResponse } from '../types/authTypes';

export const authApi = createApi({
  reducerPath: 'AuthApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/auth/',
    credentials: 'include',
  }),

  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, AuthRequest>({
      query: (userData: AuthRequest) => ({
        url: '/login',
        method: 'POST',
        body: userData,
      }),
    }),
    register: builder.mutation<AuthResponse, AuthRequest>({
      query: (userData: AuthRequest) => ({
        url: '/register',
        method: 'POST',
        body: userData,
      }),
    }),
    me: builder.query<AuthResponse, void>({
      query: () => ({
        url: '/me',
      }),
    }),

    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useMeQuery, useLogoutMutation } = authApi;
