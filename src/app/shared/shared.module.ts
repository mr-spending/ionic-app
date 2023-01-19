import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { IonicCurrencyMaskModule } from '@thiagoprz/ionic-currency-mask';

import { MoneyFormatPipe } from './pipes/money-format.pipe';

const sharedModules = [
  FormsModule,
  ReactiveFormsModule,
  IonicModule,
  TranslateModule,
  CommonModule,
  IonicCurrencyMaskModule
];

@NgModule({
  declarations: [MoneyFormatPipe],
  imports: [
    ...sharedModules,
  ],
  exports: [
    ...sharedModules,
    MoneyFormatPipe
  ]
})
export class SharedModule { }
