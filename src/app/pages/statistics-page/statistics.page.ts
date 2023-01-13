import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "@capacitor/app";

import { SpendingByCategoriesItem, SpendingModel } from "../../core/interfaces/models";
import { SpendingSelectors } from "../../core/state/selectors/spending.selectors";
import { UserSelectors } from "../../core/state/selectors/user.selectors";
import { CategoriesState } from "../../core/state/reducers/categories.reducer";
import { CategoriesActions}  from "../../core/state/actions/categories.actions";

@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {
  spendingList$: Observable<SpendingModel[]> = this.store.select(SpendingSelectors.selectSpendingListWithParams);
  currency$: Observable<string> = this.store.select(UserSelectors.selectCurrency);
  categories$: Observable<SpendingByCategoriesItem[]> = this.store.select(SpendingSelectors.selectSpendingByCategories);

  constructor(
    private store: Store<AppState>,
    private categoriesStore: Store<CategoriesState>,
  ) {
    this.categoriesStore.dispatch(CategoriesActions.categoriesList());
  }

  ngOnInit() {  }
}
