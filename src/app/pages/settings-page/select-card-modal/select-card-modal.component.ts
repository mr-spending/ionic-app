import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';
import { Observable, Subscription } from 'rxjs';

import { MonoBankAccount } from '../../../core/interfaces/models';
import { UserSelectors } from '../../../core/state/selectors/user.selectors';
import { ActionsEnum } from '../../../core/enums/action-sheet.enums';
import { BankAccountsSelectors } from '../../../core/state/selectors/bank-accounts.selectors';
import { UserActions } from '../../../core/state/actions/user.actions';

@Component({
  selector: 'select-card-modal',
  templateUrl: './select-card-modal.component.html',
  styleUrls: ['./select-card-modal.component.scss'],
})
export class SelectCardModalComponent implements OnInit {
  availableCards$: Observable<MonoBankAccount[]> = this.store.select(BankAccountsSelectors.selectAvailableCards);
  connectedMonoCards!: MonoBankAccount[];
  currency$: Observable<string> = this.store.select(UserSelectors.selectCurrency);
  actionsEnum = ActionsEnum;
  subscription: Subscription = new Subscription();

  constructor(
    private store: Store<AppState>,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.subscription.add(this.store.select(UserSelectors.selectConnectedMonoCards)
      .subscribe(value => this.connectedMonoCards = value || []));
  }

  cancel() {
    return this.modalCtrl.dismiss(null, ActionsEnum.Cancel);
  }

  confirm() {
    this.store.dispatch(UserActions.setSelectedCards({ payload: this.connectedMonoCards }));
    return this.modalCtrl.dismiss(null, ActionsEnum.Confirm);
  }

  isCardSelected(card: MonoBankAccount): boolean {
    return !!this.connectedMonoCards.find(item => item.id === card.id);
  }

  cardClick(card: MonoBankAccount): void{
    const idx = this.connectedMonoCards.findIndex(item => item.id === card.id);

    idx < 0
      ? this.connectedMonoCards = [...this.connectedMonoCards, card]
      : this.connectedMonoCards = this.connectedMonoCards.filter(item => item.id != card.id);
  }
}
