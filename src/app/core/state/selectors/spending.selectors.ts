import { createFeatureSelector, createSelector } from '@ngrx/store';

import { SpendingState, spendingStateKey } from '../reducers/spending.reducer';
import {
  SpendingFilterModel,
  SpendingModel,
  SpendingSortModel
} from '../../interfaces/models';
import { sortArrayByProperty } from '../../utils/helper.functions';

const spendingSelector = createFeatureSelector<SpendingState>(spendingStateKey);

export namespace SpendingSelectors {

  export const selectSpendingList = createSelector(spendingSelector, state => state.spendingList);
  export const selectSpendingSort = createSelector(spendingSelector, state => state.spendingSort);
  export const selectSpendingFilter = createSelector(spendingSelector, state => state.spendingFilter);

  export const selectSpendingListWithParams = createSelector(
    selectSpendingList,
    selectSpendingSort,
    selectSpendingFilter,
    (list: SpendingModel[], sort: SpendingSortModel, filter: SpendingFilterModel) => {
      const filteredList = list.filter(item => item.time > filter.from && item.time < filter.to);
      return sortArrayByProperty(filteredList, sort.field, sort.direction);
    }
  );

  export const selectTotalAmount = createSelector(
    selectSpendingListWithParams,
    (list: SpendingModel[]) => {
      return list.reduce((total, item) => total + item.amount, 0) / 100;
    }
  );

}

