import { createFeatureSelector, createSelector } from '@ngrx/store';

import { stateKey, ReducerState } from './state.reducer';

const stateSelector = createFeatureSelector<ReducerState>(stateKey);

export namespace StateSelectors {

  export const selectSpendingList = createSelector(stateSelector, state => state.spendingList);

}
