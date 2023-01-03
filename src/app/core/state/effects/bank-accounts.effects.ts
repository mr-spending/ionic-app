import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import * as moment from 'moment';

import { MonoBankApiService } from '../../api/mono-bank-api.service';
import { BankAccountsActions } from '../actions/bank-accounts.actions';
import { convertBankTransactionToModel } from '../../utils/bank-accounts.utils';

@Injectable()
export class BankAccountsEffects {

  constructor(
    private actions$: Actions,
    private mbApiService: MonoBankApiService,
  ) {}

  getTransactions$ = createEffect(() => this.actions$.pipe(
    ofType(BankAccountsActions.getTransactions),
    switchMap(({ accountIds }) => this.mbApiService.getPersonalStatement(
      accountIds[0],
      moment().subtract('months', 1).unix(),
      moment().unix()
    ).pipe(
      map(payload => BankAccountsActions.getTransactionsSuccess({ payload: convertBankTransactionToModel(payload) })),
      catchError(err => of(BankAccountsActions.getTransactionsFailure()))
    )),

  ));

}
