import { ActionReducerMap } from '@ngrx/store';

import { userStateKey, UserState, userReducer } from './reducers/user.reducer';
import { spendingStateKey, SpendingState, spendingReducer } from './reducers/spending.reducer';
import { bankAccountsKey, BankAccountsState, bankAccountsReducer } from './reducers/bank-accounts.reducer';

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
