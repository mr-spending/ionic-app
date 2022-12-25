import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';

import { DataBaseService } from '../../data-base/data-base.service';
import { SpendingActions } from '../actions/spending.actions';
import { UserSelectors } from '../selectors/user.selectors';
import { UserState } from '../reducers/user.reducer';


@Injectable()
export class SpendingEffects {

  constructor(
    private actions$: Actions,
    private dbService: DataBaseService,
    private userStore: Store<UserState>,
  ) {}

  addSpending$ = createEffect(() => this.actions$.pipe(
    ofType(SpendingActions.addSpending),
    concatLatestFrom(() => [this.userStore.select(UserSelectors.selectUserId)]),
    switchMap(([{ payload }, userId]) => this.dbService.createSpending(payload, userId).pipe(
      map((payload) => {
        return payload
          ? SpendingActions.addSpendingSuccess()
          : SpendingActions.addSpendingFailure();
      }),
    )),
  ));

  spendingList$ = createEffect(() => this.actions$.pipe(
    ofType(SpendingActions.spendingList),
    concatLatestFrom(() => [this.userStore.select(UserSelectors.selectUserId)]),
    switchMap(([_, userId]) => this.dbService.getAllSpending(userId).pipe(
      map((payload) => SpendingActions.spendingListSuccess({ payload })),
      catchError(err => of(SpendingActions.addSpendingFailure()))
    )),
  ));

}
