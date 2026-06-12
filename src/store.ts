import { configureStore } from '@reduxjs/toolkit';
import { dayRatingsApi } from './api/dayRatingsApi';
import { habitsApi } from './api/habitsApi';
import { objectivesApi } from './api/objectivesApi';
import { authApi } from './api/authApi';

export const store = configureStore({
  reducer: {
    [dayRatingsApi.reducerPath]: dayRatingsApi.reducer,
    [habitsApi.reducerPath]: habitsApi.reducer,
    [objectivesApi.reducerPath]: objectivesApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      dayRatingsApi.middleware,
      habitsApi.middleware,
      objectivesApi.middleware,
      authApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
