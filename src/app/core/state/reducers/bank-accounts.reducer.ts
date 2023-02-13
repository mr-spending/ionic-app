import { Action, createReducer, on } from '@ngrx/store';
import { BankAccountsActions } from '../actions/bank-accounts.actions';
import { BankTransaction, MonoBankAccount } from '../../interfaces/models';

export interface BankAccountsState {
  transactions: BankTransaction[];
  availableCards: MonoBankAccount[];
}

export const initialState: BankAccountsState = {
  transactions: [],
  availableCards: [],
};

export function bankAccountsReducer(state: BankAccountsState | undefined, action: Action): BankAccountsState {
  return reducer(state, action);
}

export const bankAccountsKey = 'bankAccounts';
const reducer = createReducer<BankAccountsState>(
  initialState,

  on(BankAccountsActions.transactionListSuccess, (state, { payload }) => ({ ...state, transactions: payload })),

  on(BankAccountsActions.availableCardsListSuccess, (state, { payload }) => ({ ...state, availableCards: payload })),
);
