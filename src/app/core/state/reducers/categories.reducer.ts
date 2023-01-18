import { Action, createReducer, on } from '@ngrx/store';

import { CategoryModel } from '../../interfaces/models';
import { CategoriesActions } from '../actions/categories.actions';

export interface CategoriesState {
  categories: CategoryModel[];
}

export const initialState: CategoriesState = {
  categories: [],
};

export function categoriesReducer(state: CategoriesState | undefined, action: Action): CategoriesState {
  return reducer(state, action);
}

export const categoriesStateKey = 'categories';

const reducer = createReducer<CategoriesState>(
  initialState,
  on(CategoriesActions.categoriesListSuccess, (state, { payload }) => ({ ...state, categories: payload })),
);
