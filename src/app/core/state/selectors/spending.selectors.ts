import { createFeatureSelector, createSelector } from '@ngrx/store';

import { SpendingState, spendingStateKey } from '../reducers/spending.reducer';
import {
  SpendingModel,
  SpendingSortModel
} from '../../interfaces/models';
import { sortArrayByProperty } from '../../utils/helper.functions';

const spendingSelector = createFeatureSelector<SpendingState>(spendingStateKey);

export namespace SpendingSelectors {

  export const selectSpendingHomePageList = createSelector(spendingSelector, state => state.homePageList);
  export const selectSpendingStatisticsPageList = createSelector(spendingSelector, state => state.statisticsPageList);
  export const selectSpendingSort = createSelector(spendingSelector, state => state.spendingSort);

  export const selectSpendingListWithParams = createSelector(
    selectSpendingHomePageList,
    selectSpendingSort,
    (list: SpendingModel[], sort: SpendingSortModel) => {
      return sortArrayByProperty(list, sort.field, sort.direction);
    }
  );

  export const selectTotalAmount = createSelector(
    selectSpendingListWithParams,
    (list: SpendingModel[]) => {
      return list.reduce((total, item) => total + item.amount, 0) / 100;
    }
  );
}
