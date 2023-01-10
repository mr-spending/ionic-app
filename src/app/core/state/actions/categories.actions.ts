import { createAction, props } from '@ngrx/store';

import { Category } from '../../interfaces/models';

const stateType = 'Categories';

export namespace CategoriesActions {

  export const categoriesList = createAction(`[${stateType}] Categories List`);
  export const categoriesListSuccess = createAction(`[${stateType}] Categories List Success`, props<{ payload: Category[] }>());
  export const categoriesListFailure = createAction(`[${stateType}] Categories List Failure`);

}
