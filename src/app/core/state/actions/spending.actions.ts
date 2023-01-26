import { createAction, props } from '@ngrx/store';

import { SpendingFilterModel, SpendingModel, TimePeriodModel } from '../../interfaces/models';

const stateType = 'Spending';

export namespace SpendingActions {

  export const addSpending = createAction(`[${stateType}] Add Spending`, props<{ payload: SpendingModel }>());
  export const addSpendingSuccess = createAction(`[${stateType}] Add Spending Success`);
  export const addSpendingFailure = createAction(`[${stateType}] Add Spending Failure`);

  export const removeSpending = createAction(`[${stateType}] Remove Spending`, props<{ payload: string }>());
  export const removeSpendingSuccess = createAction(`[${stateType}] Remove Spending Success`);
  export const removeSpendingFailure = createAction(`[${stateType}] Remove Spending Failure`);

  export const spendingList = createAction(`[${stateType}] Spending List`, props<{ payload: TimePeriodModel }>());
  export const spendingListSuccess = createAction(`[${stateType}] Spending List Success`, props<{ payload: SpendingModel[] }>());
  export const spendingListFailure = createAction(`[${stateType}] Spending List Failure`);

  export const updateSpendingItem = createAction(`[${stateType}] Update Spending Item`, props<{ payload: SpendingModel }>());
  export const updateSpendingItemSuccess = createAction(`[${stateType}] Update Spending Item Success`);
  export const updateSpendingItemFailure = createAction(`[${stateType}] Update Spending Item Failure`);

  export const setSpendingFilter = createAction(`[${stateType}] Set Spending Filter`, props<{ payload: SpendingFilterModel }>());

  export const setSpendingStatisticsFilter = createAction(`[${stateType}] Set Spending Statistics Filter`, props<{ payload: SpendingFilterModel }>());
}
