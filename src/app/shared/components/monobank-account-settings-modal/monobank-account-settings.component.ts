import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';
import { Observable, Subscription, timer } from 'rxjs';
import { FormBuilder, FormControl } from '@angular/forms';

import { MonoBankAccount } from '../../../core/interfaces/models';
import { UserSelectors } from '../../../core/state/selectors/user.selectors';
import { ActionsEnum } from '../../../core/enums/action-sheet.enums';
import { UserActions } from '../../../core/state/actions/user.actions';
import { CurrencyCodesEnum } from '../../../core/enums/сurrency.enums';
import { environment } from '../../../../environments/environment';
import { BankAccountsActions } from '../../../core/state/actions/bank-accounts.actions';

@Component({
  selector: 'monobank-account-settings-modal',
  templateUrl: './monobank-account-settings.component.html',
  styleUrls: ['./monobank-account-settings.component.scss'],
})
export class MonobankAccountSettingsComponent implements OnInit, OnDestroy {
  availableCards$: Observable<MonoBankAccount[] | undefined> = this.store.select(UserSelectors.selectAvailableCards);
  currency$: Observable<string> = this.store.select(UserSelectors.selectCurrency);

  subscription: Subscription = new Subscription();
  monoBankApiUrl = environment.monoBankApiUrl;
  isMonoAccSettingOpened: boolean = false;
  currencyCodesEnum = CurrencyCodesEnum;
  actionsEnum = ActionsEnum;

  connectedMonoCards!: MonoBankAccount[];
  isUpdateCardsForbidden!: boolean;
  tokenInput: FormControl;
  lastUpdateTime!: number;
  timeToUpdate!: string;
  monoToken!: string;

  constructor(
    private store: Store<AppState>,
    private modalCtrl: ModalController,
    private fb: FormBuilder,

  ) {
    this.tokenInput = this.fb.control('');
  }

  ngOnInit() {
    this.subscription.add(this.store.select(UserSelectors.selectConnectedMonoCards)
      .subscribe(value => this.connectedMonoCards = value || []));
    this.subscription.add(this.store.select(UserSelectors.selectMonoToken)
      .subscribe(value => this.monoToken = value || ''));
    this.subscription.add(this.store.select(UserSelectors.selectLastUpdateTime)
      .subscribe(value => value && (this.lastUpdateTime = value)));
    this.subscription.add(timer(0, 1000)
      .subscribe(() => {
        const timeDifference = Math.floor(new Date().getTime() / 1000) - this.lastUpdateTime;
        if (timeDifference <= 1800) {
          const lastTime = 1800 - timeDifference;
          this.isUpdateCardsForbidden = true;
          this.timeToUpdate = Math.floor(lastTime / 60) + ':' + lastTime % 60;
        } else {
          this.isUpdateCardsForbidden = false;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  cancel() {
    return this.modalCtrl.dismiss(null, ActionsEnum.Cancel);
  }

  openMonoTokenPage(): void {
    window.open(this.monoBankApiUrl, '_blank');
    this.isMonoAccSettingOpened = true;
  }

  setMonoToken(): void {
    this.store.dispatch(UserActions.setMonoToken({ payload: this.tokenInput.value }));
    this.resetSettingToken();
    this.isUpdateCardsForbidden = false;
  }

  forgetMonoToken(): void {
    this.store.dispatch(UserActions.setMonoToken({ payload: '' }));
    this.resetSettingToken();
  }

  resetSettingToken(): void {
    this.isMonoAccSettingOpened = false;
    this.tokenInput.reset();
  }

  isCardSelected(card: MonoBankAccount): boolean {
    return !!this.connectedMonoCards.find(item => item.id === card.id);
  }

  cardClick(card: MonoBankAccount): void{
    const idx = this.connectedMonoCards.findIndex(item => item.id === card.id);
    idx < 0
      ? this.connectedMonoCards = [...this.connectedMonoCards, card]
      : this.connectedMonoCards = this.connectedMonoCards.filter(item => item.id != card.id);
    this.store.dispatch(UserActions.setSelectedCards({ payload: this.connectedMonoCards }));
  }

  updateCardList(): void {
    this.store.dispatch(BankAccountsActions.availableCardsList());
  }
}
