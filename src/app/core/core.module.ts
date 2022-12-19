import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

import { DataBaseService } from './data-base/data-base.service';
import { appReducer } from './state/app.reducer';
import { SpendingEffects } from './state/effects/spending.effects';
import { environment } from '../../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AuthService } from '../auth/services/auth.service';
import { UserEffects } from './state/effects/user.effects';

const ngRxModules = [
  StoreModule.forRoot(appReducer),
  EffectsModule.forRoot([SpendingEffects, UserEffects]),
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
  providers: [DataBaseService, AuthService],
})
export class CoreModule { }
