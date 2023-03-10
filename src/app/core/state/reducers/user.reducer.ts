import { Action, createReducer, on } from '@ngrx/store';

import { UserActions } from '../actions/user.actions';
import { UserModel } from '../../interfaces/models';

export interface UserState {
  userId: string;
  user: UserModel | null;
}

export const initialState: UserState = {
  userId: '',
  user: null,
};

export function userReducer(state: UserState | undefined, action: Action): UserState {
  return reducer(state, action);
}

export const userStateKey = 'user';
const reducer = createReducer<UserState>(
  initialState,

  on(UserActions.setUserData, (state, { userId }) => ({ ...state, userId })),

  on(UserActions.setUserDataSuccess, (state, { payload }) => ({ ...state, user: payload })),
);
