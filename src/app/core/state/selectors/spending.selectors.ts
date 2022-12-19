import { createFeatureSelector, createSelector } from '@ngrx/store';

import { SpendingState } from '../app.reduser.model';
import { spendingKey } from '../app.reducer';

const spendingSelector = createFeatureSelector<SpendingState>(spendingKey);

export namespace SpendingSelectors {

  export const selectSpendingList = createSelector(spendingSelector, state => state.spendingList);

}
