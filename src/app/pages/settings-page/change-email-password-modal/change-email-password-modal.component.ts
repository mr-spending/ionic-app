import { Component, Input } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { ActionsEnum, ActionsRoleEnum } from '../../../core/enums/action-sheet.enums';
import { UserModel } from '../../../core/interfaces/models';
import { UserSelectors } from '../../../core/state/selectors/user.selectors';
import { UserEditEnum } from '../../../core/enums/user-edit.enums';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../../core/utils/custom-validators.class';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-change-email-password-modal.component',
  templateUrl: './change-email-password-modal.component.html',
  styleUrls: ['./change-email-password-modal.component.scss'],
})
export class ChangeEmailPasswordModalComponent {
  @Input() type!: UserEditEnum;

  private subscription: Subscription = new Subscription();
  userEditEnum = UserEditEnum;
  actionsEnum = ActionsEnum;

  formGroup!: FormGroup;
  user!: UserModel;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private authService: AuthService,
    private modalCtrl: ModalController,
    private translateService: TranslateService,
    private actionSheetController: ActionSheetController,
  ) {
    this.subscription.add(this.store.select(UserSelectors.selectUser).subscribe(data => {
      if (data) this.user = data ;
      if (data?.email === this.formGroup?.controls['repeatInput'].value) this.confirm();
    }));
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      currentPass: this.fb.control(null, Validators.required),
      firstInput: this.fb.control(
        null,
        this.type === this.userEditEnum.Email
          ? [Validators.required, Validators.email]
          : [Validators.required, Validators.minLength(6), Validators.maxLength(15)]
      ),
      repeatInput: this.fb.control(
        null,
        this.type === this.userEditEnum.Email
          ? [Validators.required, Validators.email]
          : [Validators.required, Validators.minLength(6), Validators.maxLength(15)]
      ),
    },
      {
        validators: CustomValidators.matchControls('firstInput', 'repeatInput')
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async changeData() {
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
    const repeatInput =  this.formGroup.controls['repeatInput'].value
    const currentPass = this.formGroup.controls['currentPass'].value
    let changeResp: any;

    if (role === ActionsRoleEnum.Confirm && this.type === this.userEditEnum.Password) {
      changeResp = await this.authService.changePassword(this.user.email, repeatInput, currentPass);
    } else if (role === ActionsRoleEnum.Confirm && this.type === this.userEditEnum.Email) {
      changeResp = await this.authService.changeEmail(this.user.email, repeatInput, currentPass);
    }
    if (changeResp) await this.confirm();
  }

  cancel() {
    return this.modalCtrl.dismiss(null, ActionsEnum.Cancel);
  }

  confirm() {
    return this.modalCtrl.dismiss(null, ActionsEnum.Confirm);
  }
}
