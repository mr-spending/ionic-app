import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';

import { ApiService } from '../../api/api.service';
import { SpendingActions } from '../actions/spending.actions';
import { UserSelectors } from '../selectors/user.selectors';
import { UserState } from '../reducers/user.reducer';
import { getCurrentMonthPeriodUNIX } from '../../utils/time.utils';
import { SpendingSelectors } from '../selectors/spending.selectors';
import { TimePeriodModel } from '../../interfaces/models';

@Injectable()
export class SpendingEffects {

  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private userStore: Store<UserState>,
  ) { }

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

  hardDeleteSpendingItem$ = createEffect(() => this.actions$.pipe(
    ofType(SpendingActions.hardDeleteSpendingItem),
    switchMap(({ payload }) => this.apiService.hardDeleteSpending(payload).pipe(
      switchMap(() => [
        SpendingActions.hardDeleteSpendingItemSuccess(),
        SpendingActions.reloadSpendingAndTransactionLists({ payload: getCurrentMonthPeriodUNIX() })
      ]),
      catchError(err => of(SpendingActions.hardDeleteSpendingItemFailure()))
    )),
  ));

  deleteSpendingByIds$ = createEffect(() => this.actions$.pipe(
    ofType(SpendingActions.deleteSpendingByIds),
    switchMap(({ payload }) => this.apiService.deleteSpendingByIds(payload).pipe(
      switchMap(() => [
        SpendingActions.deleteSpendingByIdsSuccess(),
        SpendingActions.reloadSpendingAndTransactionLists({ payload: getCurrentMonthPeriodUNIX() })
      ]),
      catchError(() => of(SpendingActions.deleteSpendingByIdsFailure()))
    )),
  ));

  hardDeleteAllRejectedSpendingItems$ = createEffect(() => this.actions$.pipe(
    ofType(SpendingActions.hardDeleteAllRejectedSpendingItems),
    switchMap(() => this.apiService.hardDeleteAllRejectedSpending().pipe(
      switchMap(() => [
        SpendingActions.hardDeleteAllRejectedSpendingItemsSuccess(),
        SpendingActions.reloadSpendingAndTransactionLists({ payload: getCurrentMonthPeriodUNIX() })
      ]),
      catchError(err => of(SpendingActions.hardDeleteAllRejectedSpendingItemsFailure()))
    )),
  ));

  homeSpendingList$ = createEffect(() => this.actions$.pipe(
    ofType(SpendingActions.homeSpendingList),
    switchMap(({ payload }) => this.apiService.getSpendingList(payload).pipe(
      map((payload) => SpendingActions.homeSpendingListSuccess({ payload })),
      catchError(err => of(SpendingActions.homeSpendingListFailure()))
    )),
  ));

  statSpendingList$ = createEffect(() => this.actions$.pipe(
    ofType(SpendingActions.statSpendingList),
    concatLatestFrom(() => [this.userStore.select(SpendingSelectors.selectStatTimePeriod)]),
    switchMap(([_, period]) => this.apiService.getSpendingList(period as TimePeriodModel).pipe(
      map((payload) => SpendingActions.statSpendingListSuccess({ payload })),
      catchError(err => of(SpendingActions.statSpendingListFailure()))
    )),
  ));

  pendingSpendingList$ = createEffect(() => this.actions$.pipe(
    ofType(SpendingActions.pendingSpendingList),
    switchMap(() => this.apiService.getPendingSpending().pipe(
      map((payload) => SpendingActions.pendingSpendingListSuccess({ payload })),
      catchError(err => of(SpendingActions.pendingSpendingListFailure()))
    )),
  ));

  deletedSpendingList$ = createEffect(() => this.actions$.pipe(
    ofType(SpendingActions.deletedSpendingList),
    switchMap(() => this.apiService.getDeletedSpending().pipe(
      map((payload) => SpendingActions.deletedSpendingListSuccess({ payload })),
      catchError(err => of(SpendingActions.deletedSpendingListFailure()))
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
    switchMap(({ payload }) => {
      return [
        SpendingActions.homeSpendingList({ payload }),
        SpendingActions.statSpendingList(),
        SpendingActions.pendingSpendingList(),
        SpendingActions.deletedSpendingList()
      ];
    }),
  ));
}
