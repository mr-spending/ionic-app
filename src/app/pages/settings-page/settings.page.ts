import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from '@capacitor/app';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AuthService } from '../../auth/services/auth.service';
import { MonobankAccountSettingsComponent } from './monobank-account-settings-modal/monobank-account-settings.component';
import { BankAccountsActions } from '../../core/state/actions/bank-accounts.actions';
import { UserActions } from '../../core/state/actions/user.actions';
import { UserSelectors } from '../../core/state/selectors/user.selectors';
import { CategoryManagementModalComponent } from './category-management-modal/category-management-modal.component';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnDestroy {
  languageControl!: FormControl;
  languageList: string[];

  private subscription: Subscription = new Subscription();
  constructor(
    private authService: AuthService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private modalCtrl: ModalController,
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

  async categoryManagementOpen() {
    const modal = await this.modalCtrl.create({ component: CategoryManagementModalComponent });
    modal.present();
    await modal.onWillDismiss();
  }

  async monoAccSettingsOpen() {
    this.store.dispatch(BankAccountsActions.availableCardsList());

    const modal = await this.modalCtrl.create({ component: MonobankAccountSettingsComponent });
    modal.present();
    await modal.onWillDismiss();
  }

  logOut(): void {
    this.authService.signOut().then();
  }
}
