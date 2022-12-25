import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExpensesListPage } from './expenses-list.page';

const routes: Routes = [
  {
    path: '',
    component: ExpensesListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpensesListPageRoutingModule {}
