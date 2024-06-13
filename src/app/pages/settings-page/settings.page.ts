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
import { CategoryManagementModalComponent } from './category-management-modal/category-management-modal.component';
import { UserEditEnum } from '../../core/enums/user-edit.enums';
import { PrivacyNoticeModalComponent } from './privacy-notice-modal/privacy-notice-modal.component';
import { environment } from '../../../environments/environment';
import { MonobankAccountSettingsComponent } from 'src/app/shared/components/monobank-account-settings-modal/monobank-account-settings.component';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnDestroy {
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

  async categoryManagementOpen(): Promise<void> {
    const modal = await this.modalCtrl.create({ component: CategoryManagementModalComponent, cssClass: 'fullscreen' });
    await modal.present();
    await modal.onWillDismiss();
  }

  async monoAccSettingsOpen(): Promise<void> {
    const modal = await this.modalCtrl.create({ component: MonobankAccountSettingsComponent, cssClass: 'fullscreen' });
    await modal.present();
    await modal.onWillDismiss();
  }

  async privacyNoticeModal() {
    const modal = await this.modalCtrl.create({ component: PrivacyNoticeModalComponent, cssClass: 'fullscreen' });
    modal.present();
    await modal.onWillDismiss()
  }

  logOut(): void {
    this.authService.signOut().then();
    window.location.reload();
  }
}
