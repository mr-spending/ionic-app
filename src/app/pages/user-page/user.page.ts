import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from '@capacitor/app';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AuthService } from '../../auth/services/auth.service';
import { UserActions } from '../../core/state/actions/user.actions';
import { UserSelectors } from '../../core/state/selectors/user.selectors';
import { ChangeEmailPasswordModalComponent } from './change-email-password-modal/change-email-password-modal.component';
import { UserEditEnum } from '../../core/enums/user-edit.enums';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-page',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnDestroy {
  userEditEnum = UserEditEnum;
  window = window;
  supportUrl = environment.supportUrl;
  deleteAccountUrl = environment.deleteAccountUrl;

  languageControl!: FormControl;
  languageList: string[];

  private subscription: Subscription = new Subscription();
  constructor(
    private authService: AuthService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private modalCtrl: ModalController
  ) {
    this.languageList = this.translateService.getLangs();
    this.subscription.add(this.store.select(UserSelectors.selectDisplayLanguage).subscribe(displayLanguage => {
        this.languageControl = this.fb.control(displayLanguage || this.languageList[0]);
      }
    ));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  languageChange(language: string): void {
    this.store.dispatch(UserActions.setUserLanguage({ payload: language }));
  }


  async changeEmailPasswordModal(type: UserEditEnum) {
    const modal = await this.modalCtrl.create({
      component: ChangeEmailPasswordModalComponent,
      componentProps: { type },
      cssClass: 'fullscreen'
    });
    await modal.present();
    await modal.onWillDismiss()
  }


  logOut(): void {
    this.authService.signOut().then();
    window.location.reload();
  }
}
