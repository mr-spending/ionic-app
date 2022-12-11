import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

import { DataBaseService } from './dataBase/data-base.service';
import { appReducer } from './state/app.reducer';
import { StateEffects } from './state/state.effects';

const ngRxModules = [
  StoreModule.forRoot(appReducer),
  EffectsModule.forRoot([StateEffects]),
  StoreDevtoolsModule.instrument({ maxAge: 100 }),
]

@NgModule({
  declarations: [],
  imports: [
    ...ngRxModules,
    CommonModule,
  ],
  providers: [DataBaseService]
})
export class CoreModule { }
