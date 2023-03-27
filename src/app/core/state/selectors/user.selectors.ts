import { createFeatureSelector, createSelector } from '@ngrx/store';

import { UserState, userStateKey } from '../reducers/user.reducer';
import { SpendingSelectors } from './spending.selectors';
import { CategoryModel, SpendingModel } from '../../interfaces/models';
import { sortArrayByProperty } from '../../utils/helper.functions';
import { DirectionEnum } from '../../enums/spending.enums';

const userSelector = createFeatureSelector<UserState>(userStateKey);

export namespace UserSelectors {

  export const selectUser = createSelector(userSelector, state => state.user);
  export const selectUserId = createSelector(userSelector, state => state.userId);
  export const selectCurrency = createSelector(userSelector, state => state.user?.currency || '₴');
  export const selectMonoToken = createSelector(userSelector, state => state.user?.monoBankClientToken);
  export const selectConnectedMonoCards = createSelector(userSelector, state => state.user?.monoBankAccounts);
  export const selectDisplayLanguage = createSelector(userSelector, state => state.user?.displayLanguage);
  export const selectUserCategories = createSelector(userSelector, state => state.user?.categories);
  export const selectLastUpdateTime = createSelector(userSelector, state => state.user?.availableMonoBankAccounts?.lastUpdateTime);
  export const selectAvailableCards = createSelector(userSelector, state =>
    sortArrayByProperty(state.user?.availableMonoBankAccounts?.availableAccounts || [], 'type', DirectionEnum.Descending)
  );

  export const selectSpendingByUserCategories = createSelector(
    SpendingSelectors.selectStatSpendingList,
    selectUserCategories,
    (spendingList: SpendingModel[], categories: CategoryModel[] | undefined) => {
      if (!categories) return [];
      const spendingByCategoriesList = categories.map(item => {
        const list = spendingList
          .filter(spItem => spItem.categoryId === item.id)
          .map(item => ({ ...item, category: categories.find(category => category.id === item.categoryId) }));
        let totalAmount = 0;
        list.forEach(item => { totalAmount += item.amount });
        return {
          ...item,
          totalAmount,
          spendingList: sortArrayByProperty(list,'time', DirectionEnum.Descending)
        }
      }).filter(item => item.spendingList.length > 0);
      return sortArrayByProperty(spendingByCategoriesList, 'totalAmount', DirectionEnum.Descending);
    }
  );
}
