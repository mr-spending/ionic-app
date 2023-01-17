import { createFeatureSelector, createSelector } from '@ngrx/store';

import { SpendingState, spendingStateKey } from '../reducers/spending.reducer';
import {
  CategoryModel,
  SpendingByCategoriesItem,
  SpendingFilterModel,
  SpendingModel,
  SpendingSortModel
} from '../../interfaces/models';
import { sortArrayByProperty } from '../../utils/helper.functions';
import { CategoriesSelectors } from './categories.selectors';

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

  export const selectSpendingByCategories = createSelector(
    selectSpendingList,
    CategoriesSelectors.selectCategories,
    (spendingList: SpendingModel[], categories: CategoryModel[]) => {

      // If there are transactions without a categoryId, we find this ID
      const spendingWithoutEmptyId = spendingList.map(item =>
          item.categoryId ? item : {...item, categoryId: categories.find(c => c.name === item.category)?.id || ''});

      return categories.reduce((acc: SpendingByCategoriesItem[], category: CategoryModel) => {
        if (spendingWithoutEmptyId.find(item => item.categoryId === category.id))
          return [...acc, {
            name: category.name,
            id: category.id,
            totalAmount: spendingWithoutEmptyId.reduce(
              (acc, item) => item.categoryId === category.id ? acc + item.amount : acc, 0
            ),
            spendingList: spendingWithoutEmptyId.reduce(
              (acc: SpendingModel[], item: SpendingModel) => item.categoryId === category.id ? [...acc, item] : acc, []
            ),
          }]
          return acc;
        }, []);
    }
  );
}

