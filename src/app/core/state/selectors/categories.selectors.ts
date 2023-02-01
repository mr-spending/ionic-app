import { createFeatureSelector, createSelector } from '@ngrx/store';

import { CategoriesState, categoriesStateKey } from '../reducers/categories.reducer';
import { CategoryModel, SpendingModel } from '../../interfaces/models';
import { SpendingSelectors } from './spending.selectors';

const categoriesSelector = createFeatureSelector<CategoriesState>(categoriesStateKey);

export namespace CategoriesSelectors {

  export const selectCategories = createSelector(categoriesSelector, state => state.categories);

  export const getCategoryById = (id: string) => createSelector(selectCategories, (categories: CategoryModel[]) =>
    categories.find(category => category?.id === id));

  export const selectSpendingByCategories = createSelector(
    SpendingSelectors.selectSpendingStatisticsPageList,
    selectCategories,
    (spendingList: SpendingModel[], categories: CategoryModel[]) => {

      // If there are transactions without a categoryId, we find this ID
      const spendingWithoutEmptyId = spendingList?.map(item =>
        item.categoryId ? item : {...item, categoryId: categories.find(c => c.name === item.category)?.id || ''});

      return categories.map(item => {
        const list = spendingWithoutEmptyId.filter(spItem => spItem.categoryId === item.id);
        let totalAmount = 0;
        list.forEach(item => { totalAmount += item.amount });
        return {
          ...item,
          totalAmount,
          spendingList: list,
        }
      }).filter(item => item.spendingList.length > 0);
    }
  );
};
