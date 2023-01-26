import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';

import { DataBaseService } from '../../data-base/data-base.service';
import { SpendingActions } from '../actions/spending.actions';
import { UserSelectors } from '../selectors/user.selectors';
import { UserState } from '../reducers/user.reducer';
import { mapSpendingList } from '../../utils/spending.utils';

@Injectable()
export class SpendingEffects {

  constructor(
    private actions$: Actions,
    private dbService: DataBaseService,
    private userStore: Store<UserState>,
  ) {}

  addSpending$ = createEffect(() => this.actions$.pipe(
    ofType(SpendingActions.addSpending),
    switchMap(({ payload }) => this.dbService.createSpending(payload).pipe(
      map((payload) => {
        return payload
          ? SpendingActions.addSpendingSuccess()
          : SpendingActions.addSpendingFailure();
      }),
    )),
  ));

  removeSpending$ = createEffect(() => this.actions$.pipe(
    ofType(SpendingActions.removeSpending),
    switchMap(({ payload }) => this.dbService.deleteSpending(payload).pipe(
      map(() => SpendingActions.removeSpendingSuccess()),
      catchError(err => of(SpendingActions.removeSpendingFailure()))
    )),
  ));

  spendingList$ = createEffect(() => this.actions$.pipe(
    ofType(SpendingActions.spendingList),
    switchMap(() => this.dbService.getAllSpending().pipe(
      map((payload) => SpendingActions.spendingListSuccess({ payload: mapSpendingList(payload) })),
      catchError(err => of(SpendingActions.addSpendingFailure()))
    )),
  ));

  updateSpendingItem$ = createEffect(() => this.actions$.pipe(
    ofType(SpendingActions.updateSpendingItem),
    concatLatestFrom(() => [this.userStore.select(UserSelectors.selectUserId)]),
    switchMap(([{ payload } , userId]) => this.dbService.updateSpendingItem({ ...payload, userId }).pipe(
      map(() => SpendingActions.updateSpendingItemSuccess()),
      catchError(err => of(SpendingActions.updateSpendingItemFailure()))
    )),
  ));
}
