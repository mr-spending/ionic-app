import { createFeatureSelector, createSelector } from '@ngrx/store';

import { bankAccountsKey, BankAccountsState } from '../reducers/bank-accounts.reducer';
import { sortArrayByProperty } from '../../utils/helper.functions';
import { DirectionEnum } from '../../enums/spending.enums';


const bankAccountsSelector = createFeatureSelector<BankAccountsState>(bankAccountsKey);

export namespace BankAccountsSelectors {

  export const selectTransactions = createSelector(bankAccountsSelector, state => sortArrayByProperty(state.transactions, 'time', DirectionEnum.Descending));
}
