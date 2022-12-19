import { createAction, props } from '@ngrx/store';

import { SpendingModel } from '../../interfaces/models';

export namespace SpendingActions {

  export const allSpendingData = createAction('[State] All Spending Data');
  export const allSpendingDataSuccess = createAction('[State] All Spending Data Success', props<{ payload: SpendingModel[] }>());
  export const allSpendingDataFailure = createAction('[State] All Spending Data Failure');

  export const spendingDataById = createAction('[State] Spending Data By Id', props<{ payload: string }>());
  export const spendingDataByIdSuccess = createAction('[State] Spending Data By Id Success', props<{ payload: SpendingModel }>());
  export const spendingDataByIdFailure = createAction('[State] Spending Data By Id Failure');

  export const createSpending = createAction('[State] Create Spending', props<{ payload: SpendingModel }>());
  export const createSpendingSuccess = createAction('[State] Create Spending Success', props<{ payload: SpendingModel }>());
  export const createSpendingFailure = createAction('[State] Create Spending Failure');

  export const updateSpending = createAction('[State] Update Spending', props<{ payload: SpendingModel }>());
  export const updateSpendingSuccess = createAction('[State] Update Spending Success', props<{ payload: SpendingModel }>());
  export const updateSpendingFailure = createAction('[State] Update Spending Failure');

  export const deleteSpending = createAction('[State] Delete Spending', props<{ payload: string }>());
  export const deleteSpendingSuccess = createAction('[State] Delete Spending Success');
  export const deleteSpendingFailure = createAction('[State] Delete Spending Failure');

}
