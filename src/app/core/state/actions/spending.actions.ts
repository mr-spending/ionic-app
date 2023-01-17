import { createAction, props } from '@ngrx/store';

import { SpendingModel } from '../../interfaces/models';

const stateType = 'Spending';

export namespace SpendingActions {

  export const addSpending = createAction(`[${stateType}] Add Spending`, props<{ payload: SpendingModel }>());
  export const addSpendingSuccess = createAction(`[${stateType}] Add Spending Success`);
  export const addSpendingFailure = createAction(`[${stateType}] Add Spending Failure`);

  export const removeSpending = createAction(`[${stateType}] Remove Spending`, props<{ payload: string }>());
  export const removeSpendingSuccess = createAction(`[${stateType}] Remove Spending Success`);
  export const removeSpendingFailure = createAction(`[${stateType}] Remove Spending Failure`);

  export const spendingList = createAction(`[${stateType}] Spending List`);
  export const spendingListSuccess = createAction(`[${stateType}] Spending List Success`, props<{ payload: SpendingModel[] }>());
  export const spendingListFailure = createAction(`[${stateType}] Spending List Failure`);

  export const updateSpending = createAction(`[${stateType}] Update Spending`, props<{ payload: SpendingModel }>());
  export const updateSpendingSuccess = createAction(`[${stateType}] Update Spending Success`);
  export const updateSpendingFailure = createAction(`[${stateType}] Update Spending Failure`);
}
