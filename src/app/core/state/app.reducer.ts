import { ActionReducerMap } from '@ngrx/store';

import {
  UserState,
  userReducer,
  userStateKey
} from './reducers/user.reducer';
import { spendingReducer, SpendingState, spendingStateKey } from './reducers/spending.reducer';
import { bankAccountsKey, bankAccountsReducer, BankAccountsState } from './reducers/bank-accounts.reducer';

interface AppState {
  [userStateKey]: UserState;
  [spendingStateKey]: SpendingState;
  [bankAccountsKey]: BankAccountsState;
}

export const appReducer: ActionReducerMap<AppState, any> = {
  [userStateKey]: userReducer,
  [spendingStateKey]: spendingReducer,
  [bankAccountsKey]: bankAccountsReducer,
};
