import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';

import { ApiService } from '../../api/api.service';
import { SpendingActions } from '../actions/spending.actions';
import { UserSelectors } from '../selectors/user.selectors';
import { UserState } from '../reducers/user.reducer';
import { mapSpendingList } from '../../utils/spending.utils';
import { SpendingState } from '../reducers/spending.reducer';
import { BankAccountsState } from '../reducers/bank-accounts.reducer';
import { BankAccountsActions } from '../actions/bank-accounts.actions';
import { getCurrentMonthPeriodUNIX } from '../../utils/time.utils';
import { SpendingSelectors } from '../selectors/spending.selectors';
import { TimePeriodModel } from '../../interfaces/models';

@Injectable()
export class SpendingEffects {

  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private userStore: Store<UserState>,
    private spendingStore: Store<SpendingState>,
    private bankAccountsStore: Store<BankAccountsState>,
  ) {}

  createSpendingItem$ = createEffect(() => this.actions$.pipe(
    ofType(SpendingActions.createSpendingItem),
    switchMap(({ payload }) => this.apiService.createSpending(payload).pipe(
      switchMap((payload) => [
        SpendingActions.createSpendingItemSuccess(),
        SpendingActions.reloadSpendingAndTransactionLists({ payload: getCurrentMonthPeriodUNIX() })
      ]),
      catchError(err => of(SpendingActions.createSpendingItemFailure())),
    )),
  ));

  deleteSpendingItem$ = createEffect(() => this.actions$.pipe(
    ofType(SpendingActions.deleteSpendingItem),
    switchMap(({ payload }) => this.apiService.deleteSpending(payload).pipe(
      switchMap(() => [
        SpendingActions.deleteSpendingItemSuccess(),
        SpendingActions.reloadSpendingAndTransactionLists({ payload: getCurrentMonthPeriodUNIX() })
      ]),
      catchError(err => of(SpendingActions.deleteSpendingItemFailure()))
    )),
  ));

  homeSpendingList$ = createEffect(() => this.actions$.pipe(
    ofType(SpendingActions.homeSpendingList),
    switchMap(({ payload }) => this.apiService.getSpendingList(payload).pipe(
      map((payload) => SpendingActions.homeSpendingListSuccess({ payload: mapSpendingList(payload) })),
      catchError(err => of(SpendingActions.homeSpendingListFailure()))
    )),
  ));

  statSpendingList$ = createEffect(() => this.actions$.pipe(
    ofType(SpendingActions.statSpendingList),
    concatLatestFrom(() => [this.userStore.select(SpendingSelectors.selectStatTimePeriod)]),
    switchMap(([_, period]) => this.apiService.getSpendingList(period as TimePeriodModel).pipe(
      map((payload) => SpendingActions.statSpendingListSuccess({ payload: mapSpendingList(payload) })),
      catchError(err => of(SpendingActions.statSpendingListFailure()))
    )),
  ));

  updateSpendingItem$ = createEffect(() => this.actions$.pipe(
    ofType(SpendingActions.updateSpendingItem),
    concatLatestFrom(() => [this.userStore.select(UserSelectors.selectUserId)]),
    switchMap(([{ payload } , userId]) => this.apiService.updateSpendingItem({ ...payload, userId }).pipe(
      switchMap(() => [
        SpendingActions.updateSpendingItemSuccess(),
        SpendingActions.reloadSpendingAndTransactionLists({ payload: getCurrentMonthPeriodUNIX() })
      ]),
      catchError(err => of(SpendingActions.updateSpendingItemFailure()))
    )),
  ));

  reloadSpendingAndTransactionLists$ = createEffect(() => this.actions$.pipe(
    ofType(SpendingActions.reloadSpendingAndTransactionLists),
    concatLatestFrom(() => [this.userStore.select(UserSelectors.selectUser)]),
    switchMap(([{ payload } , user]) => {
      if (user?.monoBankAccounts) this.bankAccountsStore.dispatch(BankAccountsActions.transactionList(
        { accounts: user.monoBankAccounts, period: payload }
      ));
      return [SpendingActions.homeSpendingList({ payload }), SpendingActions.statSpendingList()]
    }),
  ));
}
