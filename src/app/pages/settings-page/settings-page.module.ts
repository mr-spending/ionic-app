import { NgModule } from '@angular/core';

import { SettingsPageRoutingModule } from './settings-page-routing.module';
import { SettingsPage } from './settings.page';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [SettingsPage],
  imports: [
    SettingsPageRoutingModule,
    SharedModule
  ]
})
export class SettingsPageModule { }
