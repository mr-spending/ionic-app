import { Action, createReducer, on } from '@ngrx/store';

import { Category } from '../../interfaces/models';
import { CategoriesActions } from '../actions/categories.actions';

export interface CategoriesState {
  categories: Category[];
}

export const initialState: CategoriesState = {
  categories: [],
};

export const categoriesStateKey = 'categories';

const reducer = createReducer<CategoriesState>(
  initialState,
  on(CategoriesActions.categoriesListSuccess, (state, { payload }) => ({ ...state, categories: payload })),
);

export function categoriesReducer(state: CategoriesState | undefined, action: Action): CategoriesState {
  return reducer(state, action);
}
