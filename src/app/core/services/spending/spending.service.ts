import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { SpendingActions } from '../../state/actions/spending.actions';
import { getCurrentMonthPeriodUNIX } from '../../utils/time.utils';
import { CategoryModel, SpendingModel } from '../../interfaces/models';
import { ActionsEnum, ActionsRoleEnum } from '../../enums/action-sheet.enums';
import {
  ConfigureSpendingModalComponent
} from '../../../shared/components/configure-spending-modal/configure-spending-modal.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Injectable({
  providedIn: 'root'
})
export class SpendingService {

  constructor(
    private store: Store<AppState>,
    private actionSheetController: ActionSheetController,
    private modalCtrl: ModalController,
    private translateService: TranslateService,
  ) { }

  async spendingClickActionsModal(item: SpendingModel, categories: CategoryModel[]) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: this.translateService.instant('general.actions.edit'),
          data: {
            action: ActionsEnum.Edit,
          },
        },
        {
          text: this.translateService.instant('general.actions.delete'),
          role: ActionsRoleEnum.Destructive,
          data: {
            action: ActionsEnum.Delete,
          },
        },
        {
          text: this.translateService.instant('general.actions.cancel'),
          role: ActionsRoleEnum.Cancel,
          data: {
            action: ActionsEnum.Cancel,
          },
        },
      ],
    });

    await actionSheet.present();
    const result = await actionSheet.onDidDismiss();

    switch (result.data?.action) {
      case ActionsEnum.Delete:
        // this.removeSpendingItem(item.id);
        await this.selectDate('startDate')
        break;
      case ActionsEnum.Edit:
        await this.openConfigureSpendingModal({ type: ActionsEnum.Edit, categories, item });
    }
  }

  async openConfigureSpendingModal(payload: {
    type: ActionsEnum.Add | ActionsEnum.Edit,
    categories: CategoryModel[],
    item?: SpendingModel,
    amount?: number
  }) {
    const modal = await this.modalCtrl.create({
      component: ConfigureSpendingModalComponent,
      componentProps: {
        amount: payload.amount,
        categories: payload.categories,
        spendingItem: payload.item,
        type: payload.type
      }
    });
    modal.present();
    await modal.onWillDismiss();
  }

  async selectDate(target: 'startDate' | 'endDate') {
    const modal = await this.modalCtrl.create({
      component: ConfirmModalComponent,
      cssClass: 'confirm-modal',
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
  }

  removeSpendingItem(id: string) {
    this.store.dispatch(SpendingActions.deleteSpendingItem({ payload: id }));
  }

  updateSpendingList() {
    this.store.dispatch(SpendingActions.reloadSpendingAndTransactionLists({ payload: getCurrentMonthPeriodUNIX() }));
  }
}
