import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';

import { SpendingByCategoriesItem } from '../../core/interfaces/models';
import { SpendingSelectors} from '../../core/state/selectors/spending.selectors';
import { UserSelectors } from '../../core/state/selectors/user.selectors';

@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {
  spendingByCategoriesList$: Observable<SpendingByCategoriesItem[]> = this.store.select(SpendingSelectors.selectSpendingByCategories);
  currency$: Observable<string> = this.store.select(UserSelectors.selectCurrency);

  constructor(
    private store: Store<AppState>,
  ) { }

  ngOnInit() { }
}
