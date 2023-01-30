import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SelectMonthYearModalComponent } from './select-month-year-modal/select-month-year-modal.component';
import { EditSpendingModalComponent } from './edit-spending-modal/edit-spending-modal.component';

@NgModule({
  declarations: [
    PagesComponent,
    SelectMonthYearModalComponent,
    EditSpendingModalComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
  ]
})
export class PagesModule { }
