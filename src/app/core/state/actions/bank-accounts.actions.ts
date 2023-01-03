import { createAction, props } from '@ngrx/store';

const stateType = 'Bank Accounts';

export namespace BankAccountsActions {

  export const getTransactions = createAction(`[${stateType}] Get Transactions`, props<{ accountIds: string[] }>());
  export const getTransactionsSuccess = createAction(`[${stateType}] Get Transactions Success`, props<{ payload: any[] }>());
  export const getTransactionsFailure = createAction(`[${stateType}] Get Transactions Failure`);

}
