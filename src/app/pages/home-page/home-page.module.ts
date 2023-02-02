import { NgModule } from '@angular/core';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-page-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { AddSpendingModalComponent } from './add-spending-modal/add-spending-modal.component';

@NgModule({
  imports: [
    HomePageRoutingModule,
    SharedModule,
  ],
  declarations: [
    HomePage,
    AddSpendingModalComponent,
  ]
})
export class HomePageModule {}
