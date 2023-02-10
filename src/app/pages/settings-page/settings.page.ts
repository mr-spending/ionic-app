import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as moment from 'moment';

import { AuthService } from '../../auth/services/auth.service';
import { environment } from '../../../environments/environment';
import { AppState } from '@capacitor/app';
import { UserSelectors } from '../../core/state/selectors/user.selectors';
import { UserActions } from '../../core/state/actions/user.actions';
import { BankAccountsActions } from '../../core/state/actions/bank-accounts.actions';
import { MonoBankAccount } from '../../core/interfaces/models';
import { BankAccountsSelectors } from '../../core/state/selectors/bank-accounts.selectors';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {
  availableCards$: Observable<MonoBankAccount[]> = this.store.select(BankAccountsSelectors.selectAvailableCards);
  connectedMonoCards!: MonoBankAccount[];
  subscription: Subscription = new Subscription();
  languageControl: FormControl;
  languageList: string[];
  monoBankApiUrl = environment.monoBankApiUrl;
  isMonoTokenEstablished!: boolean;
  isMonoAccSettingOpened: boolean = false;
  isMonoCardsSettingOpened: boolean = false;
  tokenInput: FormControl;

  constructor(
    private authService: AuthService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router,
  ) {
    this.languageList = this.translateService.getLangs();
    this.languageControl = this.fb.control(this.languageList[0]);
    this.tokenInput = this.fb.control('');
  }

  ngOnInit() {
    this.subscription.add(this.store.select(UserSelectors.selectIsMonoTokenEstablished)
      .subscribe(value => this.isMonoTokenEstablished = value));
    this.subscription.add(this.store.select(UserSelectors.selectConnectedMonoCards)
      .subscribe(value => this.connectedMonoCards = value || []));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  logOut(): void {
    this.authService.signOut().then();
  }

  openMonoTokenPage(): void {
    window.open(this.monoBankApiUrl, '_blank');
    this.isMonoAccSettingOpened = true;
  }

  setMonoToken(): void {
    this.store.dispatch(UserActions.setMonoToken({ payload: this.tokenInput.value }));
    this.resetSettingToken();
  }

  forgetMonoToken(): void {
    this.store.dispatch(UserActions.setMonoToken({ payload: '' }));
    this.resetSettingToken();
  }

  resetSettingToken(): void {
    this.isMonoAccSettingOpened = false;
    this.tokenInput.reset();
  }

  startCardsSelecting(): void {
    this.store.dispatch(BankAccountsActions.availableCardsList());
    this.isMonoCardsSettingOpened = true
  }

  languageChange(language: string): void {
    this.translateService.use(language);
    moment.locale(language === 'ua' ? 'uk' : language);
  }
}
