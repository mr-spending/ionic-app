import { Component } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ActionsEnum, ActionsRoleEnum } from '../../../core/enums/action-sheet.enums';
import { CategoryModel } from '../../../core/interfaces/models';
import { EditCategoryModalComponent } from '../edit-category-modal/edit-category-modal.component';
import { UserActions } from '../../../core/state/actions/user.actions';
import { UserSelectors } from '../../../core/state/selectors/user.selectors';

@Component({
  selector: 'app-category-management-modal',
  templateUrl: './category-management-modal.component.html',
  styleUrls: ['./category-management-modal.component.scss'],
})
export class CategoryManagementModalComponent {
  categoryList$: Observable<CategoryModel[] | undefined> = this.store.select(UserSelectors.selectUserCategories);
  actionsEnum = ActionsEnum;

  constructor(
    private store: Store<AppState>,
    private modalCtrl: ModalController,
    private translateService: TranslateService,
    private actionSheetController: ActionSheetController
  ) { }

  async editCategory(type: ActionsEnum.Add | ActionsEnum.Edit,category?: CategoryModel) {
    const modal = await this.modalCtrl.create({
      component: EditCategoryModalComponent,
      componentProps: category ? { category, type } : { type }
    });
    modal.present();
    await modal.onWillDismiss();
  }

  async deleteCategory(id: string) {
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
    if (role === ActionsRoleEnum.Confirm) this.store.dispatch(UserActions.deleteUserCategory({ payload: id }));
  }

  cancel() {
    return this.modalCtrl.dismiss(null, ActionsEnum.Cancel);
  }

  confirm() {
    return this.modalCtrl.dismiss(null, ActionsEnum.Confirm);
  }
}
