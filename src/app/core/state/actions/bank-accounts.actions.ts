import { createAction, props } from '@ngrx/store';
import { MonoBankAccount, TimePeriodModel } from '../../interfaces/models';

const stateType = 'Bank Accounts';

export namespace BankAccountsActions {

  export const transactionList = createAction(`[${stateType}] Transaction List`, props<{ accounts: MonoBankAccount[], period: TimePeriodModel }>());
  export const transactionListSuccess = createAction(`[${stateType}] Transaction List Success`, props<{ payload: any[] }>());
  export const transactionListFailure = createAction(`[${stateType}] Transaction List Failure`);

  export const availableCardsList = createAction(`[${stateType}] Available Cards List`);
  export const availableCardsListSuccess = createAction(`[${stateType}] Available Cards List Success`, props<{ payload: MonoBankAccount[] }>());
  export const availableCardsListFailure = createAction(`[${stateType}] Available Cards List Failure`);

}
