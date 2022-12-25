import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Guid } from "typescript-guid";
import * as moment from 'moment/moment';
import { Store } from '@ngrx/store';

import { SpendingModel } from '../core/interfaces/models';
import { SpendingState } from '../core/state/reducers/spending.reducer';
import { SpendingActions } from '../core/state/actions/spending.actions';

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
    private spendingStore: Store<SpendingState>
  ) {
    this.currency = '₴';
    this.totalPerMonth = 15000.00;
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
}
