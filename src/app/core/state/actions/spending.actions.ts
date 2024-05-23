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

  export const hardDeleteSpendingItem = createAction(`[${stateType}] Hard Delete Spending Item`, props<{ payload: string }>());
  export const hardDeleteSpendingItemSuccess = createAction(`[${stateType}] Hard Delete Spending Item Success`);
  export const hardDeleteSpendingItemFailure = createAction(`[${stateType}] Hard Delete Spending Item Failure`);

  export const deleteSpendingByIds = createAction(`[${stateType}] Delete Spending By Ids`, props<{ payload: string[] }>());
  export const deleteSpendingByIdsSuccess = createAction(`[${stateType}] Delete Spending By Ids Success`);
  export const deleteSpendingByIdsFailure = createAction(`[${stateType}] Delete Spending By Ids Failure`);

  export const hardDeleteAllRejectedSpendingItems = createAction(`[${stateType}] Hard Delete All Rejected Spending Item`);
  export const hardDeleteAllRejectedSpendingItemsSuccess = createAction(`[${stateType}] Hard Delete All Rejected Spending Item Success`);
  export const hardDeleteAllRejectedSpendingItemsFailure = createAction(`[${stateType}] Hard Delete All Rejected Spending Item Failure`);

  /** Lists */
  export const homeSpendingList = createAction(`[${stateType}] Home Spending List`, props<{ payload: TimePeriodModel }>());
  export const homeSpendingListSuccess = createAction(`[${stateType}] Home Spending List Success`, props<{ payload: SpendingModel[] }>());
  export const homeSpendingListFailure = createAction(`[${stateType}] Home Spending List Failure`);

  export const statSpendingList = createAction(`[${stateType}] Statistics Spending List`);
  export const statSpendingListSuccess = createAction(`[${stateType}] Statistics Spending List Success`, props<{ payload: SpendingModel[] }>());
  export const statSpendingListFailure = createAction(`[${stateType}] Statistics Spending List Failure`);

  export const pendingSpendingList = createAction(`[${stateType}] Pending Spending List`);
  export const pendingSpendingListSuccess = createAction(`[${stateType}] Pending Spending List Success`, props<{ payload: SpendingModel[] }>());
  export const pendingSpendingListFailure = createAction(`[${stateType}] Pending Spending List Failure`);

  export const deletedSpendingList = createAction(`[${stateType}] Deleted Spending List`);
  export const deletedSpendingListSuccess = createAction(`[${stateType}] Deleted Spending List Success`, props<{ payload: SpendingModel[] }>());
  export const deletedSpendingListFailure = createAction(`[${stateType}] Deleted Spending List Failure`);

  /** Reload */
  export const updateHomePage = createAction(`[${stateType}] Update Home Page`, props<{ payload: TimePeriodModel }>());
  export const updateHomePageSuccess = createAction(`[${stateType}] Update Home Page Success`);
  export const updateHomePageFailure = createAction(`[${stateType}] Update Home Page Failure`);

  export const updateHomePageStealth = createAction(`[${stateType}] Update Home Page Stealth`, props<{ payload: TimePeriodModel }>());
  export const updateHomePageSuccessStealth  = createAction(`[${stateType}] Update Home Page Success Stealth`);
  export const updateHomePageFailureStealth  = createAction(`[${stateType}] Update Home Page Failure Stealth`);

  export const reloadSpendingAndTransactionLists = createAction(`[${stateType}] Reload Spending And Transaction Lists`, props<{ payload: TimePeriodModel }>());
  export const reloadSpendingAndTransactionListsSuccess = createAction(`[${stateType}] Reload Spending And Transaction Lists Success`);
  export const reloadSpendingAndTransactionListsFailure = createAction(`[${stateType}] Reload Spending And Transaction Lists Failure`);

  /** Time Period */
  export const updateStatTimePeriod = createAction(`[${stateType}] Update Stat Time Period`, props<{ payload: TimePeriodModel }>());
}
