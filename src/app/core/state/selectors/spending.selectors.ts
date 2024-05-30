import { createFeatureSelector, createSelector } from '@ngrx/store';

import { SpendingState, spendingStateKey } from '../reducers/spending.reducer';
import { CategoryModel, SpendingModel } from '../../interfaces/models';
import { sortArrayByProperty } from '../../utils/helper.functions';
import { DirectionEnum } from '../../enums/spending.enums';
import { groupingSpendingByDate } from '../../utils/spending.utils';
import { UserState, userStateKey } from '../reducers/user.reducer';
import * as moment from 'moment';

const spendingSelector = createFeatureSelector<SpendingState>(spendingStateKey);
const categoriesSelector = createFeatureSelector<UserState>(userStateKey);

export namespace SpendingSelectors {

  export const selectHomeSpendingList = createSelector(spendingSelector, state => state.homeSpendingList);
  export const selectStatSpendingList = createSelector(spendingSelector, state => state.statSpendingList);
  export const selectDeletedSpendingList = createSelector(spendingSelector, state => state.deletedSpendingList);
  export const selectPendingSpendingList = createSelector(spendingSelector, state => state.pendingSpendingList);
  export const selectSpendingSort = createSelector(spendingSelector, state => state.spendingSort);
  export const selectStatTimePeriod = createSelector(spendingSelector, state => state.statTimePeriod);

  const selectCategories = createSelector(categoriesSelector, state => state.user?.categories || []);

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

  export const selectCategorizedDeletedSpendingList = createSelector(
    selectDeletedSpendingList,
    selectCategories,
    (list: SpendingModel[], categories: CategoryModel[]) => {
      const sortedList = sortArrayByProperty(list, 'time', DirectionEnum.Descending) as SpendingModel[];
      return sortedList.map(spending => ({
        ...spending,
        category: categories.find(item => item.id === spending.categoryId),
      }))
    }
  );

  export const selectHomeTotalAmount = createSelector(
    selectHomeSpendingList,
    (list: SpendingModel[]) => {
      return list.reduce((total, item) => {
        if (moment(item.date).isSame(moment(), 'month')) {
          return total + item.amount;
        } else {
          return total;
        }
      }, 0) / 100;
    }
  );

  export const selectStatTotalAmount = createSelector(
    selectStatSpendingList,
    (list: SpendingModel[]) => {
      return list.reduce((total, item) => total + item.amount, 0) / 100;
    }
  );

  export const selectSortedPendingSpendingList = createSelector(
    selectPendingSpendingList,
    (list: SpendingModel[]) => {
      return sortArrayByProperty(list, 'time', DirectionEnum.Descending);
    }
  );

  export const selectStatCategoryAmount = (categoryId: string) => createSelector(
    selectStatSpendingList,
    (list: SpendingModel[]) => {
      return list.filter(el => el.categoryId === categoryId).reduce((total, item) => total + item.amount, 0) / 100;
    } 
  )
}
