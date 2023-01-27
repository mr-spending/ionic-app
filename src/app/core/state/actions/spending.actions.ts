import { createAction, props } from '@ngrx/store';

import { SpendingModel, TimePeriodModel } from '../../interfaces/models';

const stateType = 'Spending';

export namespace SpendingActions {

  export const addSpending = createAction(`[${stateType}] Add Spending`, props<{ payload: SpendingModel }>());
  export const addSpendingSuccess = createAction(`[${stateType}] Add Spending Success`);
  export const addSpendingFailure = createAction(`[${stateType}] Add Spending Failure`);

  export const removeSpending = createAction(`[${stateType}] Remove Spending`, props<{ payload: string }>());
  export const removeSpendingSuccess = createAction(`[${stateType}] Remove Spending Success`);
  export const removeSpendingFailure = createAction(`[${stateType}] Remove Spending Failure`);

  export const spendingHomePageList = createAction(`[${stateType}] Home Page List`, props<{ payload: TimePeriodModel }>());
  export const spendingHomePageListSuccess = createAction(`[${stateType}] Home Page List Success`, props<{ payload: SpendingModel[] }>());
  export const spendingHomePageListFailure = createAction(`[${stateType}] Home Page List Failure`);

  export const spendingStatisticsPageList = createAction(`[${stateType}] Statistics Page List`, props<{ payload: TimePeriodModel }>());
  export const spendingStatisticsPageListSuccess = createAction(`[${stateType}] Statistics Page List Success`, props<{ payload: SpendingModel[] }>());
  export const spendingStatisticsPageListFailure = createAction(`[${stateType}] Statistics Page List Failure`);

  export const updateSpendingItem = createAction(`[${stateType}] Update Spending Item`, props<{ payload: SpendingModel }>());
  export const updateSpendingItemSuccess = createAction(`[${stateType}] Update Spending Item Success`);
  export const updateSpendingItemFailure = createAction(`[${stateType}] Update Spending Item Failure`);
}
