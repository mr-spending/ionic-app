import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { IonicCurrencyMaskModule } from '@thiagoprz/ionic-currency-mask';

import { CustomCurrencyDirective } from './directives/custom-currency.directive';
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
  declarations: [
    CustomCurrencyDirective,
    MoneyFormatPipe,
  ],
  imports: [
    ...sharedModules,
  ],
  exports: [
    ...sharedModules,
    CustomCurrencyDirective,
    MoneyFormatPipe,
  ]
})
export class SharedModule { }
