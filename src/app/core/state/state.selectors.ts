import { createFeatureSelector, createSelector } from '@ngrx/store';

import { stateKey, reducerState } from './state.reducer';

const stateSelector = createFeatureSelector<reducerState>(stateKey);

export namespace StateSelectors {

  export const selectSpendingList = createSelector(stateSelector, state => state.spendingList);

}
