import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Guid } from "typescript-guid";
import * as moment from 'moment/moment';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { SpendingModel } from '../../core/interfaces/models';
import { SpendingState } from '../../core/state/reducers/spending.reducer';
import { SpendingActions } from '../../core/state/actions/spending.actions';
import { MainRoutesEnum, PageRoutesEnum } from '../../core/enums/routing.enums';
import { currency, totalPerMonth } from '../../core/constants/pages.constants';

@Component({
  selector: 'app-create-spending.page',
  templateUrl: 'create-spending.page.html',
  styleUrls: ['create-spending.page.scss']
})
export class CreateSpendingPage {
  formGroup: FormGroup;
  currency: string;
  totalPerMonth: number;

  constructor(
    private fb: FormBuilder,
    private spendingStore: Store<SpendingState>,
    private router: Router,
  ) {
    this.currency = currency;
    this.totalPerMonth = totalPerMonth;
    this.formGroup = this.fb.group({
      amount: this.fb.control(null, Validators.required),
      category: this.fb.control(null, Validators.required),
      description: this.fb.control(null),
    });
  }

  addSpending(): void {
    const groupValue = this.formGroup.value;
    const spendingItem: SpendingModel = {
      amount: groupValue.amount,
      category: groupValue.category,
      description: groupValue.description,
      id: Guid.create().toString(),
      date: moment().toISOString(),
    }
    this.spendingStore.dispatch(SpendingActions.addSpending({ payload: spendingItem }));
  }

  navigateToExpensesList(): void {
    this.router.navigate([`${MainRoutesEnum.Pages}/${PageRoutesEnum.ExpensesList}`]).then();
  }
}
