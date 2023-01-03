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
    switchMap(({ accounts, from, to }) => this.mbApiService.getPersonalStatement(accounts[0].id, from, to).pipe(
      map(payload => BankAccountsActions.getTransactionsSuccess({ payload: convertBankTransactionToModel(accounts[0], payload) })),
      catchError(err => of(BankAccountsActions.getTransactionsFailure()))
    )),
  ));

}
