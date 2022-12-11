import { ActionReducerMap } from '@ngrx/store';

import { stateReducer, stateKey, reducerState } from './state.reducer';

interface AppState {
  [stateKey]: reducerState;
}

export const appReducer: ActionReducerMap<AppState, any> = {
  [stateKey]: stateReducer,
};
