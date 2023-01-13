import { createFeatureSelector, createSelector } from '@ngrx/store';

import { CategoriesState, categoriesStateKey } from '../reducers/categories.reducer';
import { CategoryModel } from "../../interfaces/models";

const categoriesSelector = createFeatureSelector<CategoriesState>(categoriesStateKey);

export namespace CategoriesSelectors {

  export const selectCategories = createSelector(categoriesSelector, state => state.categories);

  export const getCategoryById = (id: string) => createSelector(selectCategories, (categories: CategoryModel[]) =>
    categories.find(category => category?.id === id));
};
