import { Action, createReducer, on } from '@ngrx/store';

import { UserState } from '../app.reduser.model';

const initialUserState: UserState = {
  userId: '',
  user: null,
};
export function userReducer(state: UserState | undefined, action: Action): UserState {
  return reducer(state, action);
}

const reducer = createReducer<UserState>(
  initialUserState,
);
