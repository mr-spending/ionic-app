import { Component, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, Subscription, take } from 'rxjs';
import { Store } from '@ngrx/store';
import * as moment from 'moment/moment';

import { LanguageEnum, languageList } from './core/constants/languages.constants';
import { UserActions } from './core/state/actions/user.actions';
import { UserState } from './core/state/reducers/user.reducer';
import { LoadingService } from './core/services/loading/loading.service';
import { UserSelectors } from './core/state/selectors/user.selectors';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnDestroy {
  isAppBuilt = false;
  isAppLoading$: Observable<boolean>;

  private subscription: Subscription = new Subscription();
  constructor(
    private translate: TranslateService,
    private angularFireAuth: AngularFireAuth,
    private userStore: Store<UserState>,
    private loader: LoadingService,
  ) {
    this.isAppLoading$ = this.loader.loading$;
    this.toggleDarkTheme(true);
    this.initializeApp();
  }

  toggleDarkTheme(shouldAdd: boolean): void {
    document.body.classList.toggle('dark', shouldAdd);
  }

  initializeApp() {
    this.translate.addLangs(languageList);
    this.translate.setDefaultLang(languageList[0]);
    this.angularFireAuth.user.pipe(take(1)).subscribe(user => {
      if (user?.uid && !this.isAppBuilt) {
        this.userStore.dispatch(UserActions.setUserData({ userId: user.uid }));
      }
      this.isAppBuilt = true;
    });
    this.subscription.add(this.userStore.select(UserSelectors.selectDisplayLanguage).subscribe(displayLanguage => {
        if (displayLanguage) {
          this.translate.use(displayLanguage);
          moment.locale(displayLanguage === LanguageEnum.UA ? 'uk' : displayLanguage);
        }
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
