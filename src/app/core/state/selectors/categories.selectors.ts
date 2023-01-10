import { createFeatureSelector, createSelector } from '@ngrx/store';

import { CategoriesState, categoriesStateKey } from '../reducers/categories.reducer';

const categoriesSelector = createFeatureSelector<CategoriesState>(categoriesStateKey);

export namespace CategoriesSelectors {

  export const selectCategories = createSelector(categoriesSelector, state => state.categories);

}
