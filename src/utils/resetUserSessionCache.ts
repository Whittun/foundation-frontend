import type { AppDispatch } from '../app/store/store';

import { objectivesApi } from '../api/objectivesApi';
import { authApi } from '../features/Auth';
import { habitsApi } from '../features/Habits';
import { dayRatingsApi } from '../features/YearTracker';

export const resetUserSessionCache = (dispatch: AppDispatch) => {
  dispatch(authApi.util.resetApiState());
  dispatch(habitsApi.util.resetApiState());
  dispatch(dayRatingsApi.util.resetApiState());
  dispatch(objectivesApi.util.resetApiState());
};
