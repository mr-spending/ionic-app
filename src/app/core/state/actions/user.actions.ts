import { createAction, props } from '@ngrx/store';

import { UserModel } from '../../interfaces/models';

const stateType = 'User';

export namespace UserActions {

  export const setUserData = createAction(`[${stateType}] Set User Data`, props<{ userId: string }>());
  export const setUserDataSuccess = createAction(`[${stateType}] Set User Data Success`, props<{ payload: UserModel }>());
  export const setUserDataFailure = createAction(`[${stateType}] Set User Data Failure`);

  export const addUser = createAction(`[${stateType}] Add User`, props<{ payload: UserModel }>());
  export const addUserSuccess = createAction(`[${stateType}] Add User Success`);
  export const addUserFailure = createAction(`[${stateType}] Add User Failure`);

}
