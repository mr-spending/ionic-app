import { ActionReducerMap } from '@ngrx/store';

import { stateReducer, stateKey, ReducerState } from './state.reducer';

interface AppState {
  [stateKey]: ReducerState;
}

export const appReducer: ActionReducerMap<AppState, any> = {
  [stateKey]: stateReducer,
};
