import { Action, createReducer, on } from '@ngrx/store';

import { SpendingModel } from '../../interfaces/models';
import { SpendingActions } from '../actions/spending.actions';

export interface SpendingState {
  spendingList: SpendingModel[];
}

export const initialState: SpendingState = {
  spendingList: [],
};

export function spendingReducer(state: SpendingState | undefined, action: Action): SpendingState {
  return reducer(state, action);
}

export const spendingStateKey = 'spending';
const reducer = createReducer<SpendingState>(
  initialState,

  on(SpendingActions.spendingListSuccess, (state, { payload }) => ({ ...state, spendingList: payload })),
);
