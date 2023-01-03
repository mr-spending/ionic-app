import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Guid } from "typescript-guid";
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IonAccordionGroup } from '@ionic/angular';
import { AppState } from '@capacitor/app';

import { BankTransaction, SpendingModel } from '../../core/interfaces/models';
import { SpendingActions } from '../../core/state/actions/spending.actions';
import { MainRoutesEnum, PageRoutesEnum } from '../../core/enums/routing.enums';
import { SpendingSelectors } from '../../core/state/selectors/spending.selectors';

import { UserSelectors } from '../../core/state/selectors/user.selectors';
import { BankAccountsSelectors } from '../../core/state/selectors/bank-accounts.selectors';

@Component({
  selector: 'app-create-spending.page',
  templateUrl: 'create-spending.page.html',
  styleUrls: ['create-spending.page.scss']
})
export class CreateSpendingPage {
  formGroup: FormGroup;
  spendingList$: Observable<SpendingModel[]> = this.store.select(SpendingSelectors.selectSortedSpendingList);
  bankTransactions$: Observable<BankTransaction[]> = this.store.select(BankAccountsSelectors.selectTransactions);
  totalAmount$: Observable<number> = this.store.select(SpendingSelectors.selectTotalAmount);
  currency$: Observable<string> = this.store.select(UserSelectors.selectCurrency);
  @ViewChild('accordionGroup', { static: true }) accordionGroup!: IonAccordionGroup;

  get isAccordionExpanded() {
    return this.accordionGroup.value === 'form-group';
  }

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router,
  ) {
    this.formGroup = this.fb.group({
      amount: this.fb.control(null, Validators.required),
      category: this.fb.control(null, Validators.required),
      description: this.fb.control(null),
    });
  }

  addSpending(): void {
    const groupValue = this.formGroup.value;
    const spendingItem: SpendingModel = {
      amount: Number(groupValue.amount.replace(/[^0-9.-]+/g,"")) * 100,
      category: groupValue.category,
      description: groupValue.description,
      id: Guid.create().toString(),
      time: Math.floor(new Date().getTime() / 1000)
    }
    this.store.dispatch(SpendingActions.addSpending({ payload: spendingItem }));
    this.formGroup.reset();
  }

  navigateToExpensesList(): void {
    this.router.navigate([`${MainRoutesEnum.Pages}/${PageRoutesEnum.ExpensesList}`]).then();
  }

  toggleAccordion = () => {
    const nativeEl = this.accordionGroup;
    if (nativeEl.value === 'form-group') {
      nativeEl.value = undefined;
    } else {
      nativeEl.value = 'form-group';
    }
  };
}
