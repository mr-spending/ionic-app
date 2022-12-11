import { Action, createReducer, on } from '@ngrx/store';

import { SpendingModel } from '../interfaces/models';

export interface ReducerState {
  userId: string,
  spendingList: SpendingModel[],
}

export const initialState: ReducerState = {
  userId: '',
  spendingList: [],
};

export function stateReducer(state: ReducerState | undefined, action: Action): ReducerState {
  return reducer(state, action);
}

export const stateKey = 'state';
const reducer = createReducer<ReducerState>(
  initialState,
);
