import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { PageRoutesEnum } from '../core/enums/routing.enums';


const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        redirectTo: PageRoutesEnum.CreateSpending,
        pathMatch: 'full'
      },
      {
        path: PageRoutesEnum.CreateSpending,
        loadChildren: () => import('./create-spending/create-spending-page.module').then(m => m.CreateSpendingPageModule),
      },
      {
        path: PageRoutesEnum.Setting,
        loadChildren: () => import('../settings-page/settings-page.module').then(m => m.SettingsPageModule),
      },
      {
        path: PageRoutesEnum.ExpensesList,
        loadChildren: () => import('./expenses-list/expenses-list-page.module').then(m => m.ExpensesListPageModule)
      },
    ]
  },
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
