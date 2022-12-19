import { ActionReducerMap } from '@ngrx/store';

import { spendingReducer } from './reducers/spending.reducer';
import { userReducer } from './reducers/user.reducer';
import { AppState } from './app.reduser.model';

export const spendingKey = 'spending';
export const userKey = 'user';

export const appReducer: ActionReducerMap<AppState, any> = {
  [spendingKey]: spendingReducer,
  [userKey]: userReducer,
};
