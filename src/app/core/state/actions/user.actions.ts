import { createAction, props } from '@ngrx/store';

import { MonoBankAccount, UserModel } from '../../interfaces/models';

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

}
