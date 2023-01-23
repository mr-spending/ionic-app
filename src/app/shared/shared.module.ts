import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { MrCurrencyMaskDirective } from './directives/mr-currency-mask.directive';
import { MrMoneyFormatPipe } from './pipes/money-format.pipe';

const declarations = [
  MrCurrencyMaskDirective,
  MrMoneyFormatPipe
];

const sharedModules = [
  FormsModule,
  ReactiveFormsModule,
  IonicModule,
  TranslateModule,
  CommonModule
];

@NgModule({
  declarations: [
    ...declarations
  ],
  imports: [
    ...sharedModules,
  ],
  exports: [
    ...sharedModules,
    ...declarations
  ]
})
export class SharedModule { }
