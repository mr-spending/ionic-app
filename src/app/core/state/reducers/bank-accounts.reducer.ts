import { Action, createReducer } from '@ngrx/store';
import { MonoBankAccount } from '../../interfaces/models';

export interface BankAccountsState {
  availableCards: MonoBankAccount[];
}

export const initialState: BankAccountsState = {
  availableCards: [],
};

export function bankAccountsReducer(state: BankAccountsState | undefined, action: Action): BankAccountsState {
  return reducer(state, action);
}

export const bankAccountsKey = 'bankAccounts';
const reducer = createReducer<BankAccountsState>(initialState);
