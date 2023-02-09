import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as moment from 'moment';

import { AuthService } from '../../auth/services/auth.service';
import { SpendingState } from '../../core/state/reducers/spending.reducer';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  languageControl: FormControl;
  languageList: string[];

  constructor(
    private authService: AuthService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private router: Router,
    private spendingStore: Store<SpendingState>,
  ) {
    this.languageList = this.translateService.getLangs();
    this.languageControl = this.fb.control(this.languageList[0]);
  }

  ngOnInit() {}

  logOut() {
    this.authService.signOut().then();
  }

  languageChange(language: string): void {
    this.translateService.use(language);
    moment.locale(language === 'ua' ? 'uk' : language);
  }

}
