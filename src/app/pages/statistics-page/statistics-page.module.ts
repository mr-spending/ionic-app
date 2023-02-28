import { NgModule } from '@angular/core';
import { NgChartsModule  } from 'ng2-charts';

import { StatisticsPageRoutingModule } from './statistics-page-routing.module';
import { StatisticsPage } from './statistics.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    StatisticsPageRoutingModule,
    NgChartsModule
  ],
  declarations: [StatisticsPage]
})
export class StatisticsPageModule {}
