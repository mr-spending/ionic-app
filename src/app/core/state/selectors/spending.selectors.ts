import { createFeatureSelector, createSelector } from '@ngrx/store';

import { SpendingState, spendingStateKey } from '../reducers/spending.reducer';
import {
  CategoryModel,
  SpendingModel,
  SpendingSortModel
} from '../../interfaces/models';
import { sortArrayByProperty } from '../../utils/helper.functions';
import { CategoriesState, categoriesStateKey } from '../reducers/categories.reducer';

const spendingSelector = createFeatureSelector<SpendingState>(spendingStateKey);
const categoriesSelector = createFeatureSelector<CategoriesState>(categoriesStateKey);

export namespace SpendingSelectors {

  export const selectHomeSpendingList = createSelector(spendingSelector, state => state.homeSpendingList);
  export const selectStatSpendingList = createSelector(spendingSelector, state => state.statSpendingList);
  export const selectSpendingSort = createSelector(spendingSelector, state => state.spendingSort);

  const selectCategories = createSelector(categoriesSelector, state => state.categories);

  export const selectSortedSpendingItemList = createSelector(
    selectHomeSpendingList,
    selectCategories,
    selectSpendingSort,
    (list: SpendingModel[], categories: CategoryModel[], sort: SpendingSortModel) => {
      const listWithCategories = list.map(spending => ({
        ...spending,
        category: categories.find(item => item.id === spending.categoryId),
      }));
      return sortArrayByProperty(listWithCategories, sort.field, sort.direction);
    }
  );

  export const selectTotalAmount = createSelector(
    selectHomeSpendingList,
    (list: SpendingModel[]) => {
      return list.reduce((total, item) => total + item.amount, 0) / 100;
    }
  );
}
