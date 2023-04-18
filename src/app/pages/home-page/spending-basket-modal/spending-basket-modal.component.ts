import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { ActionsEnum, ActionsRoleEnum } from '../../../core/enums/action-sheet.enums';
import { SpendingActions } from '../../../core/state/actions/spending.actions';
import { SpendingModel } from '../../../core/interfaces/models';
import { SpendingSelectors } from '../../../core/state/selectors/spending.selectors';
import { SpendingStatusEnum } from '../../../core/enums/spending-status.enum';
import { UserSelectors } from '../../../core/state/selectors/user.selectors';

@Component({
  selector: 'app-spending-basket-modal',
  templateUrl: './spending-basket-modal.component.html',
  styleUrls: ['./spending-basket-modal.component.scss'],
})
export class SpendingBasketModalComponent implements OnInit {
  actionsEnum = ActionsEnum;

  currency$: Observable<string> = this.store.select(UserSelectors.selectCurrency);
  deletedSpendingList$: Observable<SpendingModel[]> = this.store.select(SpendingSelectors.selectCategorizedDeletedSpendingList);

  constructor(
    private store: Store<AppState>,
    private modalCtrl: ModalController,
    private actionSheetController: ActionSheetController,
    private translateService: TranslateService,
  ) { }

  ngOnInit() {
    this.store.dispatch(SpendingActions.deletedSpendingList());
  }

  async confirmSpendingDelete(id?: string): Promise<void> {
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
    await actionSheet.present();
    const { role } = await actionSheet.onWillDismiss();
    if (role === ActionsRoleEnum.Confirm) {
      id ? this.deleteSpending(id) : this.cleanBasket();
    }
  }

  rollbackSpending(spending: SpendingModel): void {
    const updatedSpending: SpendingModel = {
      ...spending,
      status: SpendingStatusEnum.Accepted
    };
    delete updatedSpending.removalTime;
    this.store.dispatch(SpendingActions.updateSpendingItem({ payload: updatedSpending }));
  }

  deleteSpending(id: string): void {
    this.store.dispatch(SpendingActions.hardDeleteSpendingItem({ payload: id }));
  }

  cleanBasket(): void {
    this.store.dispatch(SpendingActions.hardDeleteAllRejectedSpendingItems());
  }

  cancel() {
    return this.modalCtrl.dismiss(null, ActionsEnum.Cancel);
  }
}
