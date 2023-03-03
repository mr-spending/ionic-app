import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { MrCurrencyMaskDirective } from './directives/mr-currency-mask.directive';
import { MrMoneyFormatPipe } from './pipes/money-format.pipe';
import { ConfigureSpendingModalComponent } from './components/configure-spending-modal/configure-spending-modal.component';
import { SpendingListItemComponent } from './components/spending-list-item/spending-list-item.component';
import { SelectMonthYearModalComponent } from './components/select-month-year-modal/select-month-year-modal.component';
import { MrSpendingListDateFormatPipe } from './pipes/spending-list-date-format.pipe';
import { BankCardFormatPipe } from './pipes/bank-card-format.pipe';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';

const declarations = [
  MrCurrencyMaskDirective,
  MrSpendingListDateFormatPipe,
  MrMoneyFormatPipe,
  BankCardFormatPipe,
  SpendingListItemComponent,
  ConfigureSpendingModalComponent,
  SelectMonthYearModalComponent,
  ConfirmModalComponent
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
