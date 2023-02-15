import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { AuthService } from '../auth/services/auth.service';
import { PageRoutesEnum } from '../core/enums/routing.enums';
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
      nameKey: 'home.title',
    },
    {
      route: PageRoutesEnum.Statistics,
      icon: 'list-outline',
      nameKey: 'statistics.title',
    },
    {
      route: PageRoutesEnum.Setting,
      icon: 'cog-outline',
      nameKey: 'settings.title',
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
