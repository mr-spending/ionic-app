import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';

import { ActionsEnum } from '../../../core/enums/action-sheet.enums';

@Component({
  selector: 'app-spending-basket-modal',
  templateUrl: './spending-basket-modal.component.html',
  styleUrls: ['./spending-basket-modal.component.scss'],
})
export class SpendingBasketModalComponent {
  actionsEnum = ActionsEnum;

  constructor(
    private store: Store<AppState>,
    private modalCtrl: ModalController,
  ) { }

  cancel() {
    return this.modalCtrl.dismiss(null, ActionsEnum.Cancel);
  }

  confirm() {
    return this.modalCtrl.dismiss(null, ActionsEnum.Confirm);
  }
}
