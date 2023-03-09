import { Component, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, Subscription, take } from 'rxjs';
import { Store } from '@ngrx/store';

import { languageList } from './core/constants/languages.constants';
import { UserActions } from './core/state/actions/user.actions';
import { UserState } from './core/state/reducers/user.reducer';
import { LoadingService } from './core/services/loading/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnDestroy {
  isAppLoading$: Observable<boolean>;

  subscription: Subscription = new Subscription();
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
      if (user?.uid) {
        this.userStore.dispatch(UserActions.setUserData({ userId: user.uid }));
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
