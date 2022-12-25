import { NgModule } from '@angular/core';
import { CreateSpendingPage } from './create-spending.page';
import { DecimalPipe } from '@angular/common';

import { CreateSpendingPageRoutingModule } from './create-spending-page-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CreateSpendingPageRoutingModule,
    SharedModule,
    DecimalPipe
  ],
  declarations: [CreateSpendingPage]
})
export class CreateSpendingPageModule {}
