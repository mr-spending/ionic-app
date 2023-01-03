import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { UserActions } from '../actions/user.actions';
import { DataBaseService } from '../../data-base/data-base.service';
import { UserModel } from '../../interfaces/models';
import { LocalStorageService } from '../../services/local-storage.service';

@Injectable()
export class UserEffects {

  constructor(
    private actions$: Actions,
    private dbService: DataBaseService,
    private lsService: LocalStorageService,
  ) {}

  setUserData$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.setUserData),
    switchMap(({ userId }) => this.dbService.getUserData(userId).pipe(
      map((payload: UserModel | undefined) =>
        payload
          ? UserActions.setUserDataSuccess({ payload })
          : UserActions.setUserDataFailure()
      ),
    )),
  ));

  setUserDataSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.setUserDataSuccess),
    map(({ payload }) => {
      if (payload.monoBankClientToken) {
        this.lsService.setMonoBankClientToken(payload.monoBankClientToken);
      }
    })
  ), { dispatch: false });

  addUser$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.addUser),
    switchMap(({ payload }) => this.dbService.addUser(payload).pipe(
      map(() => UserActions.addUserSuccess()),
      catchError(() => of(UserActions.addUserFailure()))
    )),
  ));

}
