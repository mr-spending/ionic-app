import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormControl } from '@angular/forms';

import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnDestroy {

  subscription: Subscription = new Subscription();
  languageControl: FormControl;
  languageList: string[];

  constructor(
    private authService: AuthService,
    private translateService: TranslateService,
    private fb: FormBuilder
  ) {
    this.languageList = this.translateService.getLangs();
    this.languageControl = this.fb.control(this.languageList[0]);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  logOut() {
    this.authService.signOut().then();
  }

  languageChange(language: string): void {
    this.translateService.use(language);
  }
}
