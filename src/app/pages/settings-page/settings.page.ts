import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import * as moment from 'moment';

import { AuthService } from '../../auth/services/auth.service';
import { AppState } from '@capacitor/app';
import { ModalController } from '@ionic/angular';
import { SelectCardModalComponent } from './select-card-modal/select-card-modal.component';
import { BankAccountsActions } from '../../core/state/actions/bank-accounts.actions';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {
  languageControl: FormControl;
  languageList: string[];

  constructor(
    private authService: AuthService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private modalCtrl: ModalController,
  ) {
    this.languageList = this.translateService.getLangs();
    this.languageControl = this.fb.control(this.languageList[0]);
  }

  languageChange(language: string): void {
    this.translateService.use(language);
    moment.locale(language === 'ua' ? 'uk' : language);
  }

  async monoAccSettingsOpen() {
    this.store.dispatch(BankAccountsActions.availableCardsList());

    const modal = await this.modalCtrl.create({ component: SelectCardModalComponent });
    modal.present();
    await modal.onWillDismiss();
  }

  logOut(): void {
    this.authService.signOut().then();
  }
}
