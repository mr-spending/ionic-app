import { createAction, props } from '@ngrx/store';

import { CategoryModel, MonoBankAccount, UserModel } from '../../interfaces/models';

const stateType = 'User';

export namespace UserActions {

  export const setUserData = createAction(`[${stateType}] Set User Data`, props<{ userId: string, user?: UserModel }>());
  export const setUserDataSuccess = createAction(`[${stateType}] Set User Data Success`, props<{ payload: UserModel }>());
  export const setUserDataFailure = createAction(`[${stateType}] Set User Data Failure`);

  export const addUser = createAction(`[${stateType}] Add User`, props<{ payload: UserModel }>());
  export const addUserSuccess = createAction(`[${stateType}] Add User Success`, props<{ user: UserModel }>());
  export const addUserFailure = createAction(`[${stateType}] Add User Failure`);

  export const setMonoToken = createAction(`[${stateType}] Set Mono Token`, props<{ payload: string }>());
  export const setMonoTokenSuccess = createAction(`[${stateType}] Set Mono Token Success`, props<{ userId: string, user?: UserModel }>());
  export const setMonoTokenFailure = createAction(`[${stateType}] Set Mono Token Failure`);

  export const setSelectedCards = createAction(`[${stateType}] Set Selected Cards`, props<{ payload: MonoBankAccount[] }>());
  export const setSelectedCardsSuccess = createAction(`[${stateType}] Set Selected Cards Success`, props<{ userId: string, user?: UserModel }>());
  export const setSelectedCardsFailure = createAction(`[${stateType}] Set Selected Cards Failure`);

  export const setUserLanguage = createAction(`[${stateType}] Set User Language`, props<{ payload: string }>());
  export const setUserLanguageSuccess = createAction(`[${stateType}] Set User Language Success`);
  export const setUserLanguageFailure = createAction(`[${stateType}] Set User Language Failure`);

  export const setAvailableCardsList = createAction(`[${stateType}] Set Available Cards List`, props<{ payload: MonoBankAccount[] }>());
  export const setAvailableCardsListSuccess = createAction(`[${stateType}] Set Available Cards List Success`);
  export const setAvailableCardsListFailure = createAction(`[${stateType}] Set Available Cards List Failure`);

  export const addUserCategory = createAction(`[${stateType}] Add User Category`, props<{ payload: CategoryModel }>());
  export const addUserCategorySuccess = createAction(`[${stateType}] Add User Category Success`);
  export const addUserCategoryFailure = createAction(`[${stateType}] Add User Category Failure`);

  export const updateUserCategory = createAction(`[${stateType}] Update User Category`, props<{ payload: CategoryModel }>());
  export const updateUserCategorySuccess = createAction(`[${stateType}] Update User Category Success`);
  export const updateUserCategoryFailure = createAction(`[${stateType}] Update User Category Failure`);

  export const deleteUserCategory = createAction(`[${stateType}] Delete User Category`, props<{ payload: string }>());
  export const deleteUserCategorySuccess = createAction(`[${stateType}] Delete User Category Success`);
  export const deleteUserCategoryFailure = createAction(`[${stateType}] Delete User Category Failure`);

  export const clearUpdateUserData = createAction(`[${stateType}] Clear Update User Data`, props<{ userId: string }>());
  export const clearUpdateUserDataSuccess = createAction(`[${stateType}] Clear Update User Data Success`, props<{ payload: UserModel }>());
  export const clearUpdateUserDataFailure = createAction(`[${stateType}] Clear Update User Data Failure`);
}
