import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { StateActions } from './stateActions';

@Injectable()
export class StateEffects {

  constructor(
    private actions$: Actions,
  ) {}

  // allSpendingData$ = createEffect(() => this.actions$.pipe(
  //   ofType(StateActions.allSpendingData),
  //   switchMap(({ event }) => this.collectionsProxyService.getCollections().pipe(
  //     map((collectionsList: CollectionModel[]) => {
  //       if (event) event();
  //       return StateActions.allSpendingDataSuccess({ collectionsList });
  //     }),
  //     catchError(err => {
  //       this.toaster.error('Collections Data Failed');
  //       return of(StateActions.allSpendingDataFailure());
  //     }),
  //   )),
  // ));

}
