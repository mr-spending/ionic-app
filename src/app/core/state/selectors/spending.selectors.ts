import { createFeatureSelector, createSelector } from '@ngrx/store';

import { SpendingState, spendingStateKey } from '../reducers/spending.reducer';
import { CategoryModel, SpendingListItemModel, SpendingModel } from '../../interfaces/models';
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

  const selectCategories = createSelector(categoriesSelector, state => state.categories);

  export const selectGroupedSpendingItemList = createSelector(
    selectHomeSpendingList,
    selectCategories,
    (list: SpendingModel[], categories: CategoryModel[]) => {
      const sortedList = sortArrayByProperty(list, 'time', DirectionEnum.Descending) as SpendingModel[];
      const groupedList = groupingSpendingByDate(sortedList);
      const groupedListWithIcons: SpendingListItemModel[][] = groupedList.map(spendingByDate =>
        spendingByDate.map(spending => ({
            ...spending,
            icon: categories.find(item => item.name === spending.category)?.icon ||
              { iconType: 'add-circle-outline', background: '#FFF' }
        }))
      );
      return groupedListWithIcons;
    }
  );

  export const selectTotalAmount = createSelector(
    selectHomeSpendingList,
    (list: SpendingModel[]) => {
      return list.reduce((total, item) => total + item.amount, 0) / 100;
    }
  );
}
