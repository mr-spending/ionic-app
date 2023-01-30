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

  createSpendingItem$ = createEffect(() => this.actions$.pipe(
    ofType(SpendingActions.createSpendingItem),
    switchMap(({ payload }) => this.apiService.createSpending(payload).pipe(
      map((payload) => {
        return payload
          ? SpendingActions.createSpendingItemSuccess()
          : SpendingActions.createSpendingItemFailure();
      }),
    )),
  ));

  deleteSpendingItem$ = createEffect(() => this.actions$.pipe(
    ofType(SpendingActions.deleteSpendingItem),
    switchMap(({ payload }) => this.apiService.deleteSpending(payload).pipe(
      map(() => SpendingActions.deleteSpendingItemSuccess()),
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
    switchMap(({ payload }) => this.apiService.getSpendingList(payload).pipe(
      map((payload) => SpendingActions.statSpendingListSuccess({ payload: mapSpendingList(payload) })),
      catchError(err => of(SpendingActions.statSpendingListFailure()))
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
