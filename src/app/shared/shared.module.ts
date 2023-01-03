import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { IonicCurrencyMaskModule } from '@thiagoprz/ionic-currency-mask';

const sharedModules = [
  FormsModule,
  ReactiveFormsModule,
  IonicModule,
  TranslateModule,
  CommonModule,
  IonicCurrencyMaskModule
];

@NgModule({
  declarations: [],
  imports: [
    ...sharedModules,
  ],
  exports: [
    ...sharedModules,
  ]
})
export class SharedModule { }
