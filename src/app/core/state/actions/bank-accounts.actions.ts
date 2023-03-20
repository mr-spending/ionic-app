import { createAction, props } from '@ngrx/store';
import { MonoBankAccount, TimePeriodModel } from '../../interfaces/models';

const stateType = 'Bank Accounts';

export namespace BankAccountsActions {

  export const transactionList = createAction(`[${stateType}] Transaction List`, props<{ accounts: MonoBankAccount[], period: TimePeriodModel }>());
  export const transactionListSuccess = createAction(`[${stateType}] Transaction List Success`, props<{ payload: any[] }>());
  export const transactionListFailure = createAction(`[${stateType}] Transaction List Failure`);

  export const deleteTransaction = createAction(`[${stateType}] Delete Transaction`, props<{ id: string }>());
  export const deleteTransactionSuccess = createAction(`[${stateType}] Delete Transaction Success`);
  export const deleteTransactionFailure = createAction(`[${stateType}] Delete Transaction Failure`);

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
