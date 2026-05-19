import { configureStore } from '@reduxjs/toolkit';
import { dayRatingsApi } from './api/dayRatingsApi';
import { habitsApi } from './api/habitsApi';
import { objectivesApi } from './api/objectivesApi';

export const store = configureStore({
  reducer: {
    [dayRatingsApi.reducerPath]: dayRatingsApi.reducer,
    [habitsApi.reducerPath]: habitsApi.reducer,
    [objectivesApi.reducerPath]: objectivesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      dayRatingsApi.middleware,
      habitsApi.middleware,
      objectivesApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
