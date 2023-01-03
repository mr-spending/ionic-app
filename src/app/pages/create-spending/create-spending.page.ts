import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Guid } from "typescript-guid";
import * as moment from 'moment/moment';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { SpendingModel } from '../../core/interfaces/models';
import { SpendingActions } from '../../core/state/actions/spending.actions';
import { MainRoutesEnum, PageRoutesEnum } from '../../core/enums/routing.enums';
import { SpendingSelectors } from '../../core/state/selectors/spending.selectors';
import { DateFormatEnum } from '../../core/enums/date-format.enums';
import { IonAccordionGroup } from '@ionic/angular';
import { AppState } from '@capacitor/app';
import { UserSelectors } from '../../core/state/selectors/user.selectors';

@Component({
  selector: 'app-create-spending.page',
  templateUrl: 'create-spending.page.html',
  styleUrls: ['create-spending.page.scss']
})
export class CreateSpendingPage {
  formGroup: FormGroup;
  spendingList$: Observable<SpendingModel[]> = this.spendingStore.select(SpendingSelectors.selectSortedSpendingList);
  totalAmount$: Observable<number> = this.spendingStore.select(SpendingSelectors.selectTotalAmount);
  currency$: Observable<string> = this.spendingStore.select(UserSelectors.selectCurrency);
  @ViewChild('accordionGroup', { static: true }) accordionGroup!: IonAccordionGroup;

  get isAccordionExpanded() {
    return this.accordionGroup.value === 'form-group';
  }

  constructor(
    private fb: FormBuilder,
    private spendingStore: Store<AppState>,
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
    this.spendingStore.dispatch(SpendingActions.addSpending({ payload: spendingItem }));
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
