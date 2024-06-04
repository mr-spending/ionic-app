import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SignInComponent } from './components/sign-in/sign-in.component';
import { AuthComponent } from './auth.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AuthRoutesEnum } from '../core/enums/routing.enums';


const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: AuthRoutesEnum.SignIn,
        pathMatch: 'full'
      },
      {
        path: AuthRoutesEnum.SignIn,
        component: SignInComponent,
      },
      {
        path: AuthRoutesEnum.SignUp,
        component: SignUpComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
