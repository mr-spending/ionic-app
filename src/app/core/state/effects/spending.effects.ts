import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';

import { DataBaseService } from '../../data-base/data-base.service';
import { SpendingActions } from '../actions/spending.actions';
import { UserSelectors } from '../selectors/user.selectors';
import { UserState } from '../reducers/user.reducer';
import { CategoriesState } from "../reducers/categories.reducer";
import { mapSpendingList } from '../../utils/spending.utils';
import {CategoriesSelectors} from "../selectors/categories.selectors";

@Injectable()
export class SpendingEffects {

  constructor(
    private actions$: Actions,
    private dbService: DataBaseService,
    private userStore: Store<UserState>,
    private categoriesStore: Store<CategoriesState>
  ) {}

  addSpending$ = createEffect(() => this.actions$.pipe(
    ofType(SpendingActions.addSpending),
    concatLatestFrom(() => [this.userStore.select(UserSelectors.selectUserId), this.categoriesStore.select(CategoriesSelectors.selectCategories)]),
    switchMap(([{ payload }, userId, categories]) => this.dbService.createSpending(payload, userId,
      categories.find(item => item.name === payload.category)?.id).pipe(
      map((payload) => {
        return payload
          ? SpendingActions.addSpendingSuccess()
          : SpendingActions.addSpendingFailure();
      }),
    )),
  ));

  removeSpending$ = createEffect(() => this.actions$.pipe(
    ofType(SpendingActions.removeSpending),
    concatLatestFrom(() => [this.userStore.select(UserSelectors.selectUserId)]),
    switchMap(([{ payload }, userId]) => this.dbService.deleteSpending(payload, userId).pipe(
      map(() => SpendingActions.removeSpendingSuccess()),
      catchError(err => of(SpendingActions.removeSpendingFailure()))
    )),
  ));

  spendingList$ = createEffect(() => this.actions$.pipe(
    ofType(SpendingActions.spendingList),
    concatLatestFrom(() => [this.userStore.select(UserSelectors.selectUserId)]),
    switchMap(([_, userId]) => this.dbService.getAllSpending(userId).pipe(
      map((payload) => SpendingActions.spendingListSuccess({ payload: mapSpendingList(payload) })),
      catchError(err => of(SpendingActions.addSpendingFailure()))
    )),
  ));

}
