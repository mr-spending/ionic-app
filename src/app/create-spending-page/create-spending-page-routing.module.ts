import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateSpendingPage } from './create-spending.page';

const routes: Routes = [
  {
    path: '',
    component: CreateSpendingPage,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateSpendingPageRoutingModule {}
