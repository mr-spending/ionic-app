import { createFeatureSelector, createSelector } from '@ngrx/store';

import { bankAccountsKey, BankAccountsState } from '../reducers/bank-accounts.reducer';
import { sortArrayByProperty } from '../../utils/helper.functions';
import { DirectionEnum } from '../../enums/spending.enums';
import { SpendingSelectors } from './spending.selectors';
import { BankTransaction, SpendingModel } from '../../interfaces/models';


const bankAccountsSelector = createFeatureSelector<BankAccountsState>(bankAccountsKey);

export namespace BankAccountsSelectors {

  export const selectTransactions = createSelector(bankAccountsSelector, state => sortArrayByProperty(state.transactions, 'time', DirectionEnum.Descending));

  export const selectAvailableCards = createSelector(bankAccountsSelector, state => state.availableCards);

  export const filteredTransactions = createSelector(
    selectTransactions,
    SpendingSelectors.selectHomeSpendingList,

    (transactions: BankTransaction[], spendingList: SpendingModel[]) => {
      return transactions.filter(item => !spendingList.some(spendItem => spendItem.id === item.id));
    }
  )
}
