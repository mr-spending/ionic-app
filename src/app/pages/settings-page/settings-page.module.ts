import { NgModule } from '@angular/core';

import { SettingsPageRoutingModule } from './settings-page-routing.module';
import { SettingsPage } from './settings.page';
import { SharedModule } from '../../shared/shared.module';
import { SelectCardModalComponent } from './select-card-modal/select-card-modal.component';



@NgModule({
  declarations: [SettingsPage, SelectCardModalComponent],
  imports: [
    SettingsPageRoutingModule,
    SharedModule
  ]
})
export class SettingsPageModule { }
