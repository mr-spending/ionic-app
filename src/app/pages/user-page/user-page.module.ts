import { NgModule } from '@angular/core';

import { UserPageRoutingModule } from './user-page-routing.module';
import { UserPage } from './user.page';
import { SharedModule } from '../../shared/shared.module';
import { ChangeEmailPasswordModalComponent } from './change-email-password-modal/change-email-password-modal.component';




@NgModule({
  declarations: [
    UserPage,
    ChangeEmailPasswordModalComponent,
  ],
  imports: [
    UserPageRoutingModule,
    SharedModule
  ]
})
export class UserPageModule { }
