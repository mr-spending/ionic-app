import { Component, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { combineLatest, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { languageList } from './core/constants/languages.constants';
import { UserActions } from './core/state/actions/user.actions';
import { UserState } from './core/state/reducers/user.reducer';
import { DataBaseService } from './core/data-base/data-base.service';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnDestroy {

  subscription: Subscription = new Subscription();
  constructor(
    private translate: TranslateService,
    private angularFireAuth: AngularFireAuth,
    private userStore: Store<UserState>,
    private db: DataBaseService,
    private user: AuthService,
  ) {
    this.toggleDarkTheme(false);
    this.initializeApp();
  }

  toggleDarkTheme(shouldAdd: boolean): void {
    document.body.classList.toggle('dark', shouldAdd);
  }

  initializeApp() {
    this.translate.addLangs(languageList);
    this.translate.setDefaultLang(languageList[0]);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
