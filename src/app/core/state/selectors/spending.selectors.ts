import { createFeatureSelector, createSelector } from '@ngrx/store';

import { SpendingState, spendingStateKey } from '../reducers/spending.reducer';
import {
  CategoryModel,
  SpendingModel,
  SpendingSortModel
} from '../../interfaces/models';
import { sortArrayByProperty } from '../../utils/helper.functions';
import { CategoriesSelectors } from './categories.selectors';
import { CategoriesState, categoriesStateKey } from '../reducers/categories.reducer';

const spendingSelector = createFeatureSelector<SpendingState>(spendingStateKey);
const categoriesSelector = createFeatureSelector<CategoriesState>(categoriesStateKey);

export namespace SpendingSelectors {

  export const selectSpendingHomePageList = createSelector(spendingSelector, state => state.homePageList);
  export const selectSpendingStatisticsPageList = createSelector(spendingSelector, state => state.statisticsPageList);
  export const selectSpendingSort = createSelector(spendingSelector, state => state.spendingSort);

  const selectCategories = createSelector(categoriesSelector, state => state.categories);

  export const selectSortedSpendingItemList = createSelector(
    selectSpendingHomePageList,
    selectCategories,
    selectSpendingSort,
    (list: SpendingModel[], categories: CategoryModel[], sort: SpendingSortModel) => {
      const listWithIcons = list.map(spending => ({
        ...spending,
        icon: categories.find(item => item.name === spending.category)?.icon ||
              { iconType: 'add-circle-outline', background: '#FFF' }
      }));
      return sortArrayByProperty(listWithIcons, sort.field, sort.direction);
    }
  );

  export const selectTotalAmount = createSelector(
    selectSpendingHomePageList,
    (list: SpendingModel[]) => {
      return list.reduce((total, item) => total + item.amount, 0) / 100;
    }
  );
}
