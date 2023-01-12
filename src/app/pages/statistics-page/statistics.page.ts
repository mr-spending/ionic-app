import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import {Store} from "@ngrx/store";
import {AppState} from "@capacitor/app";

import {BankTransaction, SpendingByCategoriesItem, SpendingModel} from "../../core/interfaces/models";
import {SpendingSelectors} from "../../core/state/selectors/spending.selectors";
import {BankAccountsSelectors} from "../../core/state/selectors/bank-accounts.selectors";
import {UserSelectors} from "../../core/state/selectors/user.selectors";

@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {
  bankTransactions$: Observable<BankTransaction[]> = this.store.select(BankAccountsSelectors.filteredTransactions);
  spendingList$: Observable<SpendingModel[]> = this.store.select(SpendingSelectors.selectSpendingListWithParams);
  currency$: Observable<string> = this.store.select(UserSelectors.selectCurrency);
  categories$: Observable<SpendingByCategoriesItem[]> = this.store.select(SpendingSelectors.selectSpendingByCategories);

  constructor(
    private store: Store<AppState>,
  ) { }

  ngOnInit() {  }
}
