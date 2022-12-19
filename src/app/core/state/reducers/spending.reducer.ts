import { Action, createReducer } from '@ngrx/store';

import { SpendingState } from '../app.reduser.model';

const initialSpendingState: SpendingState = {
  spendingList: [],
};

export function spendingReducer(state: SpendingState | undefined, action: Action): SpendingState {
  return reducer(state, action);
}

const reducer = createReducer<SpendingState>(
  initialSpendingState,
);
