import { NgModule } from '@angular/core';

import { StatisticsPageRoutingModule } from './statistics-page-routing.module';
import { StatisticsPage } from './statistics.page';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    SharedModule,
    StatisticsPageRoutingModule
  ],
  declarations: [StatisticsPage]
})
export class StatisticsPageModule {}
