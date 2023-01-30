import { Action, createReducer, on } from '@ngrx/store';
import { BankAccountsActions } from '../actions/bank-accounts.actions';
import { BankTransaction } from '../../interfaces/models';

export interface BankAccountsState {
  transactions: BankTransaction[];
}

export const initialState: BankAccountsState = {
  transactions: [],
};

export function bankAccountsReducer(state: BankAccountsState | undefined, action: Action): BankAccountsState {
  return reducer(state, action);
}

export const bankAccountsKey = 'bankAccounts';
const reducer = createReducer<BankAccountsState>(
  initialState,

  on(BankAccountsActions.transactionListSuccess, (state, { payload }) => ({ ...state, transactions: payload })),
);
