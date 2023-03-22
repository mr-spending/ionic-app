import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { MonoBankApiService } from '../../api/mono-bank-api.service';
import { BankAccountsActions } from '../actions/bank-accounts.actions';
import { configureMonoCardsList, filterBankTransactionsByCurrencyCode } from '../../utils/bank-accounts.utils';
import { CurrencyCodesEnum } from '../../enums/сurrency.enums';

@Injectable()
export class BankAccountsEffects {

  constructor(
    private actions$: Actions,
    private mbApiService: MonoBankApiService,
  ) { }

  availableCardsList$ = createEffect(() => this.actions$.pipe(
    ofType(BankAccountsActions.availableCardsList),
    switchMap(() => this.mbApiService.getPersonalClientInfo().pipe(
      map(payload => BankAccountsActions.availableCardsListSuccess({
        payload: filterBankTransactionsByCurrencyCode(configureMonoCardsList(payload), CurrencyCodesEnum.UAH)
      })),
      catchError(err => of(BankAccountsActions.availableCardsListFailure()))
    )),
  ));

  checkWebHook$ = createEffect(() => this.actions$.pipe(
    ofType(BankAccountsActions.checkWebHook),
    switchMap(() => this.mbApiService.getPersonalClientInfo().pipe(
      map(payload => payload.webHookUrl
        ? BankAccountsActions.checkWebHookSuccess()
        : BankAccountsActions.setWebHook()
      ),
      catchError(err => of(BankAccountsActions.checkWebHookFailure()))
    )),
  ));

  setWebHook$ = createEffect(() => this.actions$.pipe(
    ofType(BankAccountsActions.setWebHook),
    switchMap(() => this.mbApiService.setWebHook().pipe(
      switchMap(() => [
        BankAccountsActions.setWebHookSuccess(),
        BankAccountsActions.checkWebHookSuccess()
      ]),
      catchError(err => of(BankAccountsActions.setWebHookFailure()))
    )),
  ));
}
