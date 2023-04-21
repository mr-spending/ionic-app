import { createAction, props } from '@ngrx/store';
import { MonoBankAccount } from '../../interfaces/models';

const stateType = 'Bank Accounts';

export namespace BankAccountsActions {

  export const availableCardsList = createAction(`[${stateType}] Available Cards List`);
  export const availableCardsListSuccess = createAction(`[${stateType}] Available Cards List Success`, props<{ payload: MonoBankAccount[] }>());
  export const availableCardsListFailure = createAction(`[${stateType}] Available Cards List Failure`);

  export const checkWebHook = createAction(`[${stateType}] Check Web Hook`);
  export const checkWebHookSuccess = createAction(`[${stateType}] Check Web Hook Success`);
  export const checkWebHookFailure = createAction(`[${stateType}] Check Web Hook Failure`);

  export const setWebHook = createAction(`[${stateType}] Set Web Hook`);
  export const setWebHookSuccess = createAction(`[${stateType}] Set Web Hook Success`);
  export const setWebHookFailure = createAction(`[${stateType}] Set Web Hook Failure`);
}
