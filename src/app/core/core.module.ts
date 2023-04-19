import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { ApiService } from './api/api.service';
import { appReducer } from './state/app.reducer';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/services/auth.service';
import { UserEffects } from './state/effects/user.effects';
import { SpendingEffects } from './state/effects/spending.effects';
import { BankAccountsEffects } from './state/effects/bank-accounts.effects';
import { AlertService } from './services/alert/alert.service';
import { LoadingService } from './services/loading/loading.service';
import { SpendingService } from './services/spending/spending.service';

const ngRxModules = [
  StoreModule.forRoot(appReducer),
  EffectsModule.forRoot([UserEffects, SpendingEffects, BankAccountsEffects]),
  StoreDevtoolsModule.instrument({ maxAge: 100 }),
];

const angularFirebaseModules = [
  AngularFireModule.initializeApp(environment.firebaseConfig),
  AngularFireDatabaseModule,
  AngularFireAuthModule,
];

@NgModule({
  declarations: [],
  imports: [
    ...ngRxModules,
    ...angularFirebaseModules,
    CommonModule,
    BrowserModule,
  ],
  providers: [ApiService, AuthService, AlertService, LoadingService, SpendingService],
})
export class CoreModule { }
