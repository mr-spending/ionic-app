import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { SharedModule } from '../shared/shared.module';
import { EditSpendingModalComponent } from '../components/edit-spending-modal/edit-spending-modal.component';



@NgModule({
  declarations: [
    PagesComponent,
    EditSpendingModalComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
  ]
})
export class PagesModule { }
