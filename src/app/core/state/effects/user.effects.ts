import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { catchError, EMPTY, map, Observable, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';

import { UserActions } from '../actions/user.actions';
import { ApiService } from '../../api/api.service';
import { UserModel } from '../../interfaces/models';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { BankAccountsActions } from '../actions/bank-accounts.actions';
import { BankAccountsState } from '../reducers/bank-accounts.reducer';
import { getCurrentMonthPeriodUNIX } from '../../utils/time.utils';
import { UserSelectors } from '../selectors/user.selectors';
import { UserState } from '../reducers/user.reducer';
import { Action } from 'rxjs/internal/scheduler/Action';

@Injectable()
export class UserEffects {

  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private userStore: Store<UserState>,
    private lsService: LocalStorageService,
    private bankAccountsStore: Store<BankAccountsState>,
  ) { }

  setUserData$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.setUserData),
    switchMap(({ userId, user }) => !user ? this.apiService.getUserData(userId) : of(user)),
    map((payload: UserModel) => UserActions.setUserDataSuccess({ payload })),
    catchError(() => of(UserActions.setUserDataFailure()))
  ));

  setUserDataSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.setUserDataSuccess),
    map(({ payload }) => {
      if (payload.monoBankAccounts?.length) this.bankAccountsStore.dispatch(BankAccountsActions.transactionList({
          accounts: payload.monoBankAccounts, period: getCurrentMonthPeriodUNIX()
      }));
    })
  ), { dispatch: false });

  addUser$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.addUser),
    switchMap(({ payload }) => this.apiService.addUser(payload).pipe(
      map((user) => UserActions.addUserSuccess({ user })),
      catchError(() => of(UserActions.addUserFailure()))
    )),
  ));

  addUserSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.addUserSuccess),
    map(({ user }) => UserActions.setUserData({ userId: user.id, user }))
  ));

  setMonoToken$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.setMonoToken),
    concatLatestFrom(() => this.userStore.select(UserSelectors.selectUser)),
    switchMap(([{ payload } , user]) => {
      return this.apiService.updateUser({ ...user as UserModel, monoBankClientToken: payload, monoBankAccounts: [] }).pipe(
        map(() => UserActions.setMonoTokenSuccess({ userId: user!.id })),
        catchError(err => of(UserActions.setMonoTokenFailure()))
      )
    }),
  ));

  setUserLanguage$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.setUserLanguage),
    concatLatestFrom(() => this.userStore.select(UserSelectors.selectUser)),
    switchMap(([{ payload } , user]) => {
      return this.apiService.updateUser({ ...user as UserModel, displayLanguage: payload }).pipe(
        map(() => UserActions.setUserLanguageSuccess()),
        catchError(err => of(UserActions.setUserLanguageFailure()))
      )
    }),
  ));

  setUserLanguageSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.setUserLanguageSuccess),
    switchMap(() => {
      window.location.reload();
      return null as unknown as Observable<any>;
    }),
  ));

  setSelectedCards$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.setSelectedCards),
    concatLatestFrom(() => this.userStore.select(UserSelectors.selectUser)),
    switchMap(([{ payload } , user]) => {
      return this.apiService.updateUser({ ...user as UserModel, monoBankAccounts: payload }).pipe(
        map(() => UserActions.setSelectedCardsSuccess({ userId: user!.id })),
        catchError(err => of(UserActions.setSelectedCardsFailure()))
      )
    }),
  ));
}
