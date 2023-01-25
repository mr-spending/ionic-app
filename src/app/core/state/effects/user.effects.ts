import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';

import { UserActions } from '../actions/user.actions';
import { DataBaseService } from '../../data-base/data-base.service';
import { UserModel } from '../../interfaces/models';
import { LocalStorageService } from '../../services/local-storage.service';
import { BankAccountsActions } from '../actions/bank-accounts.actions';
import { BankAccountsState } from '../reducers/bank-accounts.reducer';
import * as moment from 'moment/moment';

@Injectable()
export class UserEffects {

  constructor(
    private actions$: Actions,
    private dbService: DataBaseService,
    private lsService: LocalStorageService,
    private bankAccountsStore: Store<BankAccountsState>,
  ) {}

  setUserData$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.setUserData),
    switchMap(({ userId, user }) => !user ? this.dbService.getUserData(userId) : of(user)),
    map((payload: UserModel) => UserActions.setUserDataSuccess({ payload })),
    catchError(() => of(UserActions.setUserDataFailure()))
  ));

  setUserDataSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.setUserDataSuccess),
    map(({ payload }) => {
      if (payload.monoBankClientToken) {
        this.lsService.setMonoBankClientToken(payload.monoBankClientToken);
      }

      if (payload.monoBankAccounts && payload.monoBankAccounts.length) {
        this.bankAccountsStore.dispatch(BankAccountsActions.getTransactions({
          accounts: payload.monoBankAccounts,
          from: moment().subtract(1, 'months').unix(),
          to: moment().unix(),
        }));
      }
    })
  ), { dispatch: false });

  addUser$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.addUser),
    switchMap(({ payload }) => this.dbService.addUser(payload).pipe(
      map((user) => UserActions.addUserSuccess({ user })),
      catchError(() => of(UserActions.addUserFailure()))
    )),
  ));

  addUserSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.addUserSuccess),
    map(({ user }) => UserActions.setUserData({ userId: user.id, user }))
  ));
}
