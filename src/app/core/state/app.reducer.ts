import { ActionReducerMap } from '@ngrx/store';

import {
  UserState,
  userReducer,
  userStateKey
} from './reducers/user.reducer';
import { spendingReducer, SpendingState, spendingStateKey } from './reducers/spending.reducer';

interface AppState {
  [userStateKey]: UserState;
  [spendingStateKey]: SpendingState;
}

export const appReducer: ActionReducerMap<AppState, any> = {
  [userStateKey]: userReducer,
  [spendingStateKey]: spendingReducer,
};
