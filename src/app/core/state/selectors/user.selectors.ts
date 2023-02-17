import { createFeatureSelector, createSelector } from '@ngrx/store';

import { UserState, userStateKey } from '../reducers/user.reducer';

const userSelector = createFeatureSelector<UserState>(userStateKey);

export namespace UserSelectors {

  export const selectUser = createSelector(userSelector, state => state.user);
  export const selectUserId = createSelector(userSelector, state => state.userId);
  export const selectCurrency = createSelector(userSelector, state => state.user?.currency || '₴');
  export const selectMonoToken = createSelector(userSelector, state => state.user?.monoBankClientToken);
  export const selectConnectedMonoCards = createSelector(userSelector, state => state.user?.monoBankAccounts);
}
