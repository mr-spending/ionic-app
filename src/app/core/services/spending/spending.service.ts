import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';
import { ActionSheetController,  ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { SpendingActions } from '../../state/actions/spending.actions';
import { getCurrentMonthPeriodUNIX } from '../../utils/time.utils';
import { CategoryModel, SpendingModel } from '../../interfaces/models';
import { ActionsEnum, ActionsRoleEnum } from '../../enums/action-sheet.enums';
import { ConfigureSpendingModalComponent } from '../../../shared/components/configure-spending-modal/configure-spending-modal.component';
import { SpendingDetailsModalComponent } from 'src/app/shared/components/spending-details-modal/spending-details-modal.component';

@Injectable()
export class SpendingService {

  constructor(
    private store: Store<AppState>,
    private actionSheetController: ActionSheetController,
    private modalCtrl: ModalController,
    private translateService: TranslateService,
  ) { }

  async spendingClickActionsModal(item: SpendingModel, categories: CategoryModel[]): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: this.translateService.instant('spendingDetailsModal.title'),
          data: {
            action: ActionsEnum.Details
          }
        },
        {
          text: this.translateService.instant('general.actions.edit'),
          data: {
            action: ActionsEnum.Edit,
          },
        },
        {
          text: this.translateService.instant('general.actions.removeToBasket'),
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
      case ActionsEnum.Delete: await this.confirmRemove(item.id); break
      case ActionsEnum.Edit: await this.openConfigureSpendingModal({ type: ActionsEnum.Edit, categories, item }); break
      case ActionsEnum.Details: await this.openDetailsSpendingModel({ item })
    }
  }

  async openConfigureSpendingModal(payload: {
    type: ActionsEnum.Add | ActionsEnum.Edit,
    categories: CategoryModel[],
    item?: SpendingModel,
    amount?: number,
    isAmountChangeable?: boolean
  }): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ConfigureSpendingModalComponent,
      componentProps: {
        amount: payload.amount,
        categories: payload.categories,
        spendingItem: payload.item,
        type: payload.type,
        isAmountChangeable: payload.isAmountChangeable
      },
      cssClass: 'fullscreen',
      breakpoints: [0, 0.4, 0.9, 1],
      initialBreakpoint: 0.9
    });
    modal.present();
    await modal.onWillDismiss();
  }

  async openDetailsSpendingModel(payload: {
    item: SpendingModel
  }): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: SpendingDetailsModalComponent,
      componentProps:{
        amount: payload.item.amount,
        description: payload.item.description,
        category: payload.item.category,
        date: payload.item.date
      },
      cssClass: 'fullscreen',
      breakpoints: [0, 0.4, 0.9, 1],
      initialBreakpoint: 0.9
    })
    modal.present();
    await modal.onWillDismiss();
  }

  async confirmRemove(id: string): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      header: this.translateService.instant('general.messages.areYouSure'),
      buttons: [
        {
          text: this.translateService.instant('general.actions.yes'),
          role: ActionsRoleEnum.Confirm,
        },
        {
          text: this.translateService.instant('general.actions.no'),
          role: ActionsRoleEnum.Cancel,
        },
      ],
    });
    actionSheet.present();
    const { role } = await actionSheet.onWillDismiss();
    switch (role) {
      case ActionsRoleEnum.Confirm: this.removeSpendingItem(id); break
    }
  }

  removeSpendingItem(id: string): void {
    this.store.dispatch(SpendingActions.deleteSpendingItem({ payload: id }));
  }

  updateHomePage(event: any): void {
    this.store.dispatch(SpendingActions.updateHomePage({ payload: getCurrentMonthPeriodUNIX() }));
    event.target.complete()
  }

  updateSpendingList(): void {
    this.store.dispatch(SpendingActions.reloadSpendingAndTransactionLists({ payload: getCurrentMonthPeriodUNIX() }));
  }
}
