import { createFeatureSelector, createSelector } from '@ngrx/store';

import { SpendingState, spendingStateKey } from '../reducers/spending.reducer';
import { SpendingModel, SpendingSortModel } from '../../interfaces/models';

const spendingSelector = createFeatureSelector<SpendingState>(spendingStateKey);

export namespace SpendingSelectors {

  export const selectSpendingList = createSelector(spendingSelector, state => state.spendingList);
  export const selectSpendingSort = createSelector(spendingSelector, state => state.spendingSort);

  export const selectSortedSpendingList = createSelector(
    selectSpendingList,
    selectSpendingSort,
    (list: SpendingModel[], sort: SpendingSortModel) => {
      return list;
    }
  );

  export const selectTotalAmount = createSelector(
    selectSpendingList,
    (list: SpendingModel[]) => {
      return list.reduce((total, item) => total + item.amount, 0);
    }
  );
}
