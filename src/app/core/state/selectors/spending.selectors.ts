import { createFeatureSelector, createSelector } from '@ngrx/store';

import { SpendingState, spendingStateKey } from '../reducers/spending.reducer';
import { CategoryModel, GroupedSpendingModel, SpendingModel } from '../../interfaces/models';
import { sortArrayByProperty } from '../../utils/helper.functions';
import { CategoriesState, categoriesStateKey } from '../reducers/categories.reducer';
import { DirectionEnum } from '../../enums/spending.enums';
import { groupingSpendingByDate } from '../../utils/spending.utils';

const spendingSelector = createFeatureSelector<SpendingState>(spendingStateKey);
const categoriesSelector = createFeatureSelector<CategoriesState>(categoriesStateKey);

export namespace SpendingSelectors {

  export const selectHomeSpendingList = createSelector(spendingSelector, state => state.homeSpendingList);
  export const selectStatSpendingList = createSelector(spendingSelector, state => state.statSpendingList);
  export const selectSpendingSort = createSelector(spendingSelector, state => state.spendingSort);
  export const selectStatTimePeriod = createSelector(spendingSelector, state => state.statTimePeriod);

  const selectCategories = createSelector(categoriesSelector, state => state.categories);

  export const selectGroupedSpendingItemList = createSelector(
    selectHomeSpendingList,
    selectCategories,
    (list: SpendingModel[], categories: CategoryModel[]) => {
      const sortedList = sortArrayByProperty(list, 'time', DirectionEnum.Descending) as SpendingModel[];
      const sortedListWithCategories = sortedList.map(spending => ({
        ...spending,
        category: categories.find(item => item.id === spending.categoryId),
      }))
      return groupingSpendingByDate(sortedListWithCategories);
    }
  );

  export const selectHomeTotalAmount = createSelector(
    selectHomeSpendingList,
    (list: SpendingModel[]) => {
      return list.reduce((total, item) => total + item.amount, 0) / 100;
    }
  );

  export const selectStatTotalAmount = createSelector(
    selectStatSpendingList,
    (list: SpendingModel[]) => {
      return list.reduce((total, item) => total + item.amount, 0) / 100;
    }
  );
}
