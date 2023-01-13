import { createFeatureSelector, createSelector } from '@ngrx/store';

import { CategoriesState, categoriesStateKey } from '../reducers/categories.reducer';
import { Category } from "../../interfaces/models";

const categoriesSelector = createFeatureSelector<CategoriesState>(categoriesStateKey);

export namespace CategoriesSelectors {

  export const selectCategories = createSelector(categoriesSelector, state => state.categories);

  export const getCategoryById = (id: string) => createSelector(selectCategories, (categories: Category[]) =>
    categories.find(category => category?.id === id));
};
