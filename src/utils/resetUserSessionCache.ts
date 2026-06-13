import type { AppDispatch } from '../app/store/store';

import { authApi } from '../api/authApi';
import { habitsApi } from '../api/habitsApi';
import { dayRatingsApi } from '../api/dayRatingsApi';
import { objectivesApi } from '../api/objectivesApi';

export const resetUserSessionCache = (dispatch: AppDispatch) => {
  dispatch(authApi.util.resetApiState());
  dispatch(habitsApi.util.resetApiState());
  dispatch(dayRatingsApi.util.resetApiState());
  dispatch(objectivesApi.util.resetApiState());
};
