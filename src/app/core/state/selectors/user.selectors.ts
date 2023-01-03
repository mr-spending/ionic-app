import { createFeatureSelector, createSelector } from '@ngrx/store';

import { UserState, userStateKey } from '../reducers/user.reducer';

const userSelector = createFeatureSelector<UserState>(userStateKey);

export namespace UserSelectors {

  export const selectUserId = createSelector(userSelector, state => state.userId);
  export const selectCurrency = createSelector(userSelector, state => {
    return state.user?.currency ? state.user?.currency : '₴';
  });
}
