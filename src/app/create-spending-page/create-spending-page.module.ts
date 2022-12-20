import { NgModule } from '@angular/core';
import { CreateSpendingPage } from './create-spending.page';

import { CreateSpendingPageRoutingModule } from './create-spending-page-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DecimalPipe } from '@angular/common';

@NgModule({
  imports: [
    CreateSpendingPageRoutingModule,
    SharedModule,
    DecimalPipe
  ],
  declarations: [CreateSpendingPage]
})
export class CreateSpendingPageModule {}
