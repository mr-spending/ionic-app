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

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnDestroy {

  subscription: Subscription = new Subscription();
  languageControl: FormControl;
  languageList: string[];
  pageTitle: string = '';

  constructor(
    private authService: AuthService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private router: Router,
    private spendingStore: Store<SpendingState>,
  ) {
    this.languageList = this.translateService.getLangs();
    this.languageControl = this.fb.control(this.languageList[0]);
    this.subscription.add(this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) this.updatePageTitle(event.url);
    }));
    this.spendingStore.dispatch(SpendingActions.spendingList());

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  logOut() {
    this.authService.signOut().then();
  }

  languageChange(language: string): void {
    this.translateService.use(language);
  }

  updatePageTitle(url: string): void {
    if (url.includes(PageRoutesEnum.CreateSpending)) {
      this.pageTitle = this.translateService.instant('pages.createSpending');
    } else if (url.includes(PageRoutesEnum.ExpensesList)) {
      this.pageTitle = this.translateService.instant('pages.listOfExpenses');
    }
  }

}
