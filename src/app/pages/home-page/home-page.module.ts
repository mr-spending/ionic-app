import { NgModule } from '@angular/core';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-page-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { SpendingBasketModalComponent } from './spending-basket-modal/spending-basket-modal.component';

@NgModule({
  imports: [
    HomePageRoutingModule,
    SharedModule,
  ],
  declarations: [
    HomePage,
    SpendingBasketModalComponent
  ]
})
export class HomePageModule {}
