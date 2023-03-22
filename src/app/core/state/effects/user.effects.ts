import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';

import { UserActions } from '../actions/user.actions';
import { ApiService } from '../../api/api.service';
import { UserModel } from '../../interfaces/models';
import { getCurrentMonthPeriodUNIX } from '../../utils/time.utils';
import { UserSelectors } from '../selectors/user.selectors';
import { UserState } from '../reducers/user.reducer';
import { SpendingActions } from '../actions/spending.actions';

@Injectable()
export class UserEffects {

  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private userStore: Store<UserState>,
  ) { }

  setUserData$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.setUserData),
    switchMap(({ userId, user }) => !user ? this.apiService.getUserData(userId) : of(user)),
    map((payload: UserModel) => UserActions.setUserDataSuccess({ payload })),
    catchError(() => of(UserActions.setUserDataFailure()))
  ));

  setUserDataSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.setUserDataSuccess),
    map(({ payload }) => SpendingActions.pendingSpendingList()),
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

  updateUserAndTransactionList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.setMonoTokenSuccess, UserActions.setSelectedCardsSuccess),
      switchMap(({ userId }) => [
        UserActions.setUserData({ userId }),
        SpendingActions.pendingSpendingListSuccess({ payload: [] })
      ]),
    );
  });

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

  addUserCategory$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.addUserCategory),
    switchMap(({ payload }) => this.apiService.addUserCategory(payload)),
    map(() => UserActions.addUserCategorySuccess()),
    catchError(() => of(UserActions.addUserCategoryFailure()))
  ));

  updateUserCategory$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.updateUserCategory),
    switchMap(({ payload }) => this.apiService.updateUserCategory(payload)),
    map(() => UserActions.updateUserCategorySuccess()),
    catchError(() => of(UserActions.updateUserCategoryFailure()))
  ));

  deleteUserCategory$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.deleteUserCategory),
    switchMap(({ payload }) => this.apiService.deleteUserCategory(payload).pipe(
      switchMap(() => [
        UserActions.deleteUserCategorySuccess(),
        SpendingActions.reloadSpendingAndTransactionLists({ payload: getCurrentMonthPeriodUNIX() })
      ]),
      catchError(() => of(UserActions.deleteUserCategoryFailure()))
    )),
  ));

  userCategoryOperationSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(
      UserActions.addUserCategorySuccess,
      UserActions.updateUserCategorySuccess,
      UserActions.deleteUserCategorySuccess
    ),
    concatLatestFrom(() => this.userStore.select(UserSelectors.selectUserId)),
    switchMap(([{}, userId]) => [UserActions.clearUpdateUserData({ userId })]),
  ));

  clearUpdateUserData$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.clearUpdateUserData),
    switchMap(({ userId }) => this.apiService.getUserData(userId)),
    map((payload: UserModel) => UserActions.clearUpdateUserDataSuccess({ payload })),
    catchError(() => of(UserActions.clearUpdateUserDataFailure()))
  ));
}
