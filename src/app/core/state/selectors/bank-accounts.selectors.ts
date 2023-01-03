import { createFeatureSelector, createSelector } from '@ngrx/store';
import { bankAccountsKey, BankAccountsState } from '../reducers/bank-accounts.reducer';


const bankAccountsSelector = createFeatureSelector<BankAccountsState>(bankAccountsKey);

export namespace BankAccountsSelectors {

  export const selectTransactions = createSelector(bankAccountsSelector, state => state.transactions);
}
