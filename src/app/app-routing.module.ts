import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { MainRoutesEnum } from './core/enums/routing.enums';

const routes: Routes = [
  {
    path: '',
    redirectTo: MainRoutesEnum.Pages,
    pathMatch: 'full'
  },
  {
    path: MainRoutesEnum.Pages,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
  },
  {
    path: MainRoutesEnum.Auth,
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
