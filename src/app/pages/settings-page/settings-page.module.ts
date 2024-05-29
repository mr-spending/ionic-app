import { NgModule } from '@angular/core';

import { SettingsPageRoutingModule } from './settings-page-routing.module';
import { SettingsPage } from './settings.page';
import { SharedModule } from '../../shared/shared.module';
import { EditCategoryModalComponent } from './edit-category-modal/edit-category-modal.component';
import { CategoryManagementModalComponent } from './category-management-modal/category-management-modal.component';
import { PrivacyNoticeModalComponent } from './privacy-notice-modal/privacy-notice-modal.component';



@NgModule({
  declarations: [
    SettingsPage,
    CategoryManagementModalComponent,
    EditCategoryModalComponent,
    PrivacyNoticeModalComponent
  ],
  imports: [
    SettingsPageRoutingModule,
    SharedModule
  ]
})
export class SettingsPageModule { }
