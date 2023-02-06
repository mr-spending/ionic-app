import { NgModule } from '@angular/core';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-page-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    HomePageRoutingModule,
    SharedModule,
  ],
  declarations: [
    HomePage,
  ]
})
export class HomePageModule {}
