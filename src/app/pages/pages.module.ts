import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { SharedModule } from '../shared/shared.module';
import { EditSpendingModalModule } from "../components/edit-spending-modal/edit-spending-modal.module";



@NgModule({
  declarations: [PagesComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    EditSpendingModalModule,
  ]
})
export class PagesModule { }
