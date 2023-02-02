import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { MrCurrencyMaskDirective } from './directives/mr-currency-mask.directive';
import { MrMoneyFormatPipe } from './pipes/money-format.pipe';
import { EditSpendingModalComponent } from './components/edit-spending-modal/edit-spending-modal.component';
import { SpendingListItemComponent } from './components/spending-list-item/spending-list-item.component';
import { BankTransactionListItemComponent } from './components/bank-transactions-list-item/bank-transactions-list-item.component';
import { SelectMonthYearModalComponent } from './components/select-month-year-modal/select-month-year-modal.component';

const declarations = [
  MrCurrencyMaskDirective,
  MrMoneyFormatPipe,
  SpendingListItemComponent,
  BankTransactionListItemComponent,
  EditSpendingModalComponent,
  SelectMonthYearModalComponent,
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
