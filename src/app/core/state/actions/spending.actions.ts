import { createAction, props } from '@ngrx/store';

import { SpendingModel, TimePeriodModel } from '../../interfaces/models';

const stateType = 'Spending';

export namespace SpendingActions {

  /** Create */
  export const createSpendingItem = createAction(`[${stateType}] Create Spending Item`, props<{ payload: SpendingModel }>());
  export const createSpendingItemSuccess = createAction(`[${stateType}] Create Spending Item Success`);
  export const createSpendingItemFailure = createAction(`[${stateType}] Create Spending Item Failure`);

  /** Update */
  export const updateSpendingItem = createAction(`[${stateType}] Update Spending Item`, props<{ payload: SpendingModel }>());
  export const updateSpendingItemSuccess = createAction(`[${stateType}] Update Spending Item Success`);
  export const updateSpendingItemFailure = createAction(`[${stateType}] Update Spending Item Failure`);

  /** Delete */
  export const deleteSpendingItem = createAction(`[${stateType}] Delete Spending Item`, props<{ payload: string }>());
  export const deleteSpendingItemSuccess = createAction(`[${stateType}] Delete Spending Item Success`);
  export const deleteSpendingItemFailure = createAction(`[${stateType}] Delete Spending Item Failure`);

  /** Lists */
  export const homeSpendingList = createAction(`[${stateType}] Home Spending List`, props<{ payload: TimePeriodModel }>());
  export const homeSpendingListSuccess = createAction(`[${stateType}] Home Spending List Success`, props<{ payload: SpendingModel[] }>());
  export const homeSpendingListFailure = createAction(`[${stateType}] Home Spending List Failure`);

  export const statSpendingList = createAction(`[${stateType}] Statistics Spending List`);
  export const statSpendingListSuccess = createAction(`[${stateType}] Statistics Spending List Success`, props<{ payload: SpendingModel[] }>());
  export const statSpendingListFailure = createAction(`[${stateType}] Statistics Spending List Failure`);

  /** Reload */

  export const reloadSpendingAndTransactionLists = createAction(`[${stateType}] Reload Spending And Transaction Lists`, props<{ payload: TimePeriodModel }>());
  export const reloadSpendingAndTransactionListsSuccess = createAction(`[${stateType}] Reload Spending And Transaction Lists Success`);
  export const reloadSpendingAndTransactionListsFailure = createAction(`[${stateType}] Reload Spending And Transaction Lists Failure`);

  /** Time Period */

  export const updateStatTimePeriod = createAction(`[${stateType}] Update Stat Time Period`, props<{ payload: TimePeriodModel }>());

}
