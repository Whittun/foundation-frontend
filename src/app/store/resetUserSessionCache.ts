import type { AppDispatch } from './store';

import { authApi } from '../../features/Auth/api/authApi';
import { habitsApi } from '../../features/Habits';
import { objectivesApi } from '../../features/Objectives';
import { dayRatingsApi } from '../../features/YearTracker';

export const resetUserSessionCache = (dispatch: AppDispatch) => {
  dispatch(authApi.util.resetApiState());
  dispatch(habitsApi.util.resetApiState());
  dispatch(dayRatingsApi.util.resetApiState());
  dispatch(objectivesApi.util.resetApiState());
};
