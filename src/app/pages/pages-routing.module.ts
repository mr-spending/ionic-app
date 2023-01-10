import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { PageRoutesEnum } from '../core/enums/routing.enums';
import { StatisticsPageModule } from './statistics-page/statistics-page.module';

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
        path: PageRoutesEnum.Statistics,
        loadChildren: () => import('./statistics-page/statistics-page.module').then(m => m.StatisticsPageModule),
      },
      {
        path: PageRoutesEnum.Setting,
        loadChildren: () => import('./settings-page/settings-page.module').then(m => m.SettingsPageModule),
      },
    ]
  },
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
