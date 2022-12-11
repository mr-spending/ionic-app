import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { PageRoutesEnum } from '../core/interfaces/enums';


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
        loadChildren: () => import('../create-spending-page/create-spending-page.module').then(m => m.CreateSpendingPageModule),
      },
      {
        path: PageRoutesEnum.Setting,
        loadChildren: () => import('../settings-page/settings-page.module').then(m => m.SettingsPageModule),
      },
    ]
  },
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
