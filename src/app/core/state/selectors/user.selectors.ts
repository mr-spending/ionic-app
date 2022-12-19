import { createFeatureSelector, createSelector } from '@ngrx/store';

import { UserState } from '../app.reduser.model';
import { userKey } from '../app.reducer';


const userSelector = createFeatureSelector<UserState>(userKey);

export namespace UserSelectors {

  export const selectUser = createSelector(userSelector, state => state.user);
  export const selectUserId = createSelector(userSelector, state => state.userId);

}
