import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { MonoBankApiService } from '../../api/mono-bank-api.service';
import { BankAccountsActions } from '../actions/bank-accounts.actions';
import {
  configureMonoCardsList,
  convertBankTransactionToModel,
  filterBankTransactionsByCurrencyCode
} from '../../utils/bank-accounts.utils';
import { CurrencyCodesEnum } from '../../enums/сurrency.enums';
import { ApiService } from '../../api/api.service';

@Injectable()
export class BankAccountsEffects {

  constructor(
    private actions$: Actions,
    private mbApiService: MonoBankApiService,
    private ApiService: ApiService,
  ) { }

  transactionList$ = createEffect(() => this.actions$.pipe(
    ofType(BankAccountsActions.transactionList),
    switchMap(({ accounts, period }) => this.ApiService.getBankTransactionsList(period).pipe(
      map(payload => BankAccountsActions.transactionListSuccess({
          payload: convertBankTransactionToModel(accounts, payload)
        })
      ),
      catchError(err => of(BankAccountsActions.transactionListFailure()))
    )),
  ));

  availableCardsList$  = createEffect(() => this.actions$.pipe(
    ofType(BankAccountsActions.availableCardsList),
    switchMap(() => this.mbApiService.getPersonalClientInfo().pipe(
      map(payload => BankAccountsActions.availableCardsListSuccess({
          payload: filterBankTransactionsByCurrencyCode(configureMonoCardsList(payload), CurrencyCodesEnum.UAH)
        })
      ),
      catchError(err => of(BankAccountsActions.availableCardsListFailure()))
    )),
  ));

}
