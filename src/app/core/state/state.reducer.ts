import { Action, createReducer, on } from '@ngrx/store';

import { SpendingModel } from '../interface/spendingModel';

export interface reducerState {
  userId: string,
  spendingList: SpendingModel[],
}

export const initialState: reducerState = {
  userId: '',
  spendingList: [],
};

export function stateReducer(state: reducerState | undefined, action: Action): reducerState {
  return reducer(state, action);
}

export const stateKey = 'state';
const reducer = createReducer<reducerState>(
  initialState,
);
