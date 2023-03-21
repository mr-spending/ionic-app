import { Action, createReducer, on } from '@ngrx/store';
import { BankAccountsActions } from '../actions/bank-accounts.actions';
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
const reducer = createReducer<BankAccountsState>(
  initialState,

  on(BankAccountsActions.availableCardsListSuccess, (state, { payload }) => ({ ...state, availableCards: payload })),

  on(BankAccountsActions.availableCardsListFailure, (state) => ({ ...state, availableCards: [] })),

);
