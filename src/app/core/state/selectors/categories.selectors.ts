import { createFeatureSelector, createSelector } from '@ngrx/store';

import { CategoriesState, categoriesStateKey } from '../reducers/categories.reducer';
import { CategoryModel, SpendingModel } from '../../interfaces/models';
import { SpendingSelectors } from './spending.selectors';
import { sortArrayByProperty } from '../../utils/helper.functions';
import { DirectionEnum } from '../../enums/spending.enums';

const categoriesSelector = createFeatureSelector<CategoriesState>(categoriesStateKey);

export namespace CategoriesSelectors {

  export const selectCategories = createSelector(categoriesSelector, state => state.categories);

  export const getCategoryById = (id: string) => createSelector(selectCategories, (categories: CategoryModel[]) =>
    categories.find(category => category?.id === id));

  export const selectSpendingByCategories = createSelector(
    SpendingSelectors.selectStatSpendingList,
    selectCategories,
    (spendingList: SpendingModel[], categories: CategoryModel[]) => {

      const spendingByCategoriesList = categories.map(item => {
        const list = spendingList.filter(spItem => spItem.categoryId === item.id);
        let totalAmount = 0;
        list.forEach(item => { totalAmount += item.amount });
        return {
          ...item,
          totalAmount,
          spendingList: list,
        }
      }).filter(item => item.spendingList.length > 0);

      return sortArrayByProperty(spendingByCategoriesList, 'totalAmount', DirectionEnum.Descending);
    }
  );
};
