import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { ApiService } from '../../api/api.service';
import { CategoriesActions } from '../actions/categories.actions';


@Injectable()
export class CategoriesEffects {

  constructor(
    private actions$: Actions,
    private apiService: ApiService,
  ) {}

  categoriesList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CategoriesActions.categoriesList),
      switchMap(() => this.apiService.getAllCategories().pipe(
          map((payload) => CategoriesActions.categoriesListSuccess({ payload })),
          catchError(() => of(CategoriesActions.categoriesListFailure()))
        )
      ),
    );
  });
}
