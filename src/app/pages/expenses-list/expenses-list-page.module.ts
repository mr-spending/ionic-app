import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExpensesListPageRoutingModule } from './expenses-list-page-routing.module';

import { ExpensesListPage } from './expenses-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExpensesListPageRoutingModule
  ],
  declarations: [ExpensesListPage]
})
export class ExpensesListPageModule {}
