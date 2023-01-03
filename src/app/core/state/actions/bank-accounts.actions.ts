import { createAction, props } from '@ngrx/store';
import { MonoBankAccount } from '../../interfaces/models';

const stateType = 'Bank Accounts';

export namespace BankAccountsActions {

  export const getTransactions = createAction(`[${stateType}] Get Transactions`, props<{ accounts: MonoBankAccount[], from: number, to: number }>());
  export const getTransactionsSuccess = createAction(`[${stateType}] Get Transactions Success`, props<{ payload: any[] }>());
  export const getTransactionsFailure = createAction(`[${stateType}] Get Transactions Failure`);

}
