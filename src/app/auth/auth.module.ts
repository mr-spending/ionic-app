import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { AuthComponent } from './auth.component';
import { AuthService } from './services/auth.service';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';



@NgModule({
  declarations: [
    AuthComponent,
    SignInComponent,
    SignUpComponent
  ],
  providers: [AuthService],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    AngularFireAuthModule,
  ]
})
export class AuthModule { }
