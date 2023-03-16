import { NgModule } from '@angular/core';

import { SettingsPageRoutingModule } from './settings-page-routing.module';
import { SettingsPage } from './settings.page';
import { SharedModule } from '../../shared/shared.module';
import { MonobankAccountSettingsComponent } from './monobank-account-settings-modal/monobank-account-settings.component';
import { EditCategoryModalComponent } from './edit-category-modal/edit-category-modal.component';
import { CategoryManagementModalComponent } from './category-management-modal/category-management-modal.component';



@NgModule({
  declarations: [
    SettingsPage,
    MonobankAccountSettingsComponent,
    CategoryManagementModalComponent,
    EditCategoryModalComponent
  ],
  imports: [
    SettingsPageRoutingModule,
    SharedModule
  ]
})
export class SettingsPageModule { }
