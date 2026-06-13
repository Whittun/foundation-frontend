import { configureStore } from '@reduxjs/toolkit';
import { objectivesApi } from '../../api/objectivesApi';
import { authApi } from '../../features/Auth';
import { habitsApi } from '../../features/Habits';
import { dayRatingsApi } from '../../features/YearTracker';

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
