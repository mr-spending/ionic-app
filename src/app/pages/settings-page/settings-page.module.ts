import { NgModule } from '@angular/core';

import { SettingsPageRoutingModule } from './settings-page-routing.module';
import { SettingsPage } from './settings.page';
import { SharedModule } from '../../shared/shared.module';
import { MonobankAccountSettingsComponent } from './select-card-modal/monobank-account-settings.component';



@NgModule({
  declarations: [SettingsPage, MonobankAccountSettingsComponent],
  imports: [
    SettingsPageRoutingModule,
    SharedModule
  ]
})
export class SettingsPageModule { }
