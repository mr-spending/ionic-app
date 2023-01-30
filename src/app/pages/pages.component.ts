import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { NavigationEnd, Router } from '@angular/router';

import { AuthService } from '../auth/services/auth.service';
import { PageRoutesEnum } from '../core/enums/routing.enums';
import { SpendingState } from '../core/state/reducers/spending.reducer';
import { SpendingActions } from '../core/state/actions/spending.actions';
import { CategoriesActions } from '../core/state/actions/categories.actions';
import { CategoriesState } from '../core/state/reducers/categories.reducer';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnDestroy {

  subscription: Subscription = new Subscription();
  tabs = [
    {
      route: PageRoutesEnum.CreateSpending,
      icon: 'bag-add-outline',
    },
    {
      route: PageRoutesEnum.Statistics,
      icon: 'list-outline',
    },
    {
      route: PageRoutesEnum.Setting,
      icon: 'cog-outline',
    },

  ];

  constructor(
    private authService: AuthService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private router: Router,
    private categoriesStore: Store<CategoriesState>,
  ) {
    this.categoriesStore.dispatch(CategoriesActions.categoriesList());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
