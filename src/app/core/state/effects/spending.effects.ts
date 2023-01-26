import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';

import { ApiService } from '../../api/api.service';
import { SpendingActions } from '../actions/spending.actions';
import { UserSelectors } from '../selectors/user.selectors';
import { UserState } from '../reducers/user.reducer';
import { mapSpendingList } from '../../utils/spending.utils';

@Injectable()
export class SpendingEffects {

  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private userStore: Store<UserState>,
  ) {}

  addSpending$ = createEffect(() => this.actions$.pipe(
    ofType(SpendingActions.addSpending),
    switchMap(({ payload }) => this.apiService.createSpending(payload).pipe(
      map((payload) => {
        return payload
          ? SpendingActions.addSpendingSuccess()
          : SpendingActions.addSpendingFailure();
      }),
    )),
  ));

  removeSpending$ = createEffect(() => this.actions$.pipe(
    ofType(SpendingActions.removeSpending),
    switchMap(({ payload }) => this.apiService.deleteSpending(payload).pipe(
      map(() => SpendingActions.removeSpendingSuccess()),
      catchError(err => of(SpendingActions.removeSpendingFailure()))
    )),
  ));

  spendingMainPageList$ = createEffect(() => this.actions$.pipe(
    ofType(SpendingActions.spendingMainPageList),
    switchMap(({ payload }) => this.apiService.getAllSpendingByPeriod(payload).pipe(
      map((payload) => SpendingActions.spendingMainPageListSuccess({ payload: mapSpendingList(payload) })),
      catchError(err => of(SpendingActions.spendingMainPageListFailure()))
    )),
  ));

  spendingStatisticsPageList$ = createEffect(() => this.actions$.pipe(
    ofType(SpendingActions.spendingStatisticsPageList),
    switchMap(({ payload }) => this.apiService.getAllSpendingByPeriod(payload).pipe(
      map((payload) => SpendingActions.spendingStatisticsPageListSuccess({ payload: mapSpendingList(payload) })),
      catchError(err => of(SpendingActions.spendingStatisticsPageListFailure()))
    )),
  ));

  updateSpendingItem$ = createEffect(() => this.actions$.pipe(
    ofType(SpendingActions.updateSpendingItem),
    concatLatestFrom(() => [this.userStore.select(UserSelectors.selectUserId)]),
    switchMap(([{ payload } , userId]) => this.apiService.updateSpendingItem({ ...payload, userId }).pipe(
      map(() => SpendingActions.updateSpendingItemSuccess()),
      catchError(err => of(SpendingActions.updateSpendingItemFailure()))
    )),
  ));
}
