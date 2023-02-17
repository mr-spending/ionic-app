import { Component, OnDestroy } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';

import { AuthService } from '../auth/services/auth.service';
import { PageRoutesEnum } from '../core/enums/routing.enums';
import { CategoriesActions } from '../core/state/actions/categories.actions';
import { UserSelectors } from '../core/state/selectors/user.selectors';
import { AppState } from '@capacitor/app';
import { BankAccountsActions } from '../core/state/actions/bank-accounts.actions';

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
    private store: Store<AppState>,
  ) {
    this.store.dispatch(CategoriesActions.categoriesList());
    this.subscription.add(this.store.select(UserSelectors.selectUser)
      .pipe(take(2))
      .subscribe(value => value?.monoBankAccounts?.length && this.store.dispatch(BankAccountsActions.checkWebHook()))
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
