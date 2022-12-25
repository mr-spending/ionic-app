import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { currency, totalPerMonth } from '../../core/constants/pages.constants';
import { SpendingState } from '../../core/state/reducers/spending.reducer';
import { SpendingModel } from '../../core/interfaces/models';
import { SpendingSelectors } from '../../core/state/selectors/spending.selectors';

@Component({
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.page.html',
  styleUrls: ['./expenses-list.page.scss'],
})
export class ExpensesListPage implements OnInit, OnDestroy {
  currency: string;
  totalPerMonth: number;
  spendingList?: SpendingModel[];

  subscription: Subscription = new Subscription();

  constructor(
    private spendingStore: Store<SpendingState>
  ) {
    this.currency = currency;
    this.totalPerMonth = totalPerMonth;

    this.subscription.add(this.spendingStore.select(SpendingSelectors.selectSpendingList).subscribe(spendingList => {
      this.spendingList = spendingList;
    }));

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
