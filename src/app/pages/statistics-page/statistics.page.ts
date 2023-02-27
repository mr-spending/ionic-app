import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';
import { ChartData } from 'chart.js';

import { CategoryModel, SpendingByCategoriesItem } from '../../core/interfaces/models';
import { UserSelectors } from '../../core/state/selectors/user.selectors';
import { CategoriesSelectors } from '../../core/state/selectors/categories.selectors';
import { getCustomPeriodUNIX } from '../../core/utils/time.utils';
import { SpendingActions } from '../../core/state/actions/spending.actions';
import { SpendingService } from '../../core/services/spending/spending.service';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit, OnDestroy {
  spendingByCategoriesList$: Observable<SpendingByCategoriesItem[]> = this.store.select(CategoriesSelectors.selectSpendingByCategories);
  currency$: Observable<string> = this.store.select(UserSelectors.selectCurrency);
  subscription: Subscription = new Subscription();
  categoryList!: CategoryModel[];

  selectedPeriod!: 'week'| 'month'| 'year';

  constructor(
    private store: Store<AppState>,
    public spendingService : SpendingService,
  ) { }

  ngOnInit() {
    this.subscription.add(this.store.select(CategoriesSelectors.selectCategories)
      .subscribe((categories: CategoryModel[]) => this.categoryList = categories),
    );
    this.onPeriodSelect('month');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onPeriodSelect(period: 'week'| 'month'| 'year'): void {
    const periodStart = moment().startOf(period).format('YYYY-MM-DD');
    const periodEnd = moment().endOf(period).format('YYYY-MM-DD');
    this.store.dispatch(SpendingActions.statSpendingList({ payload: getCustomPeriodUNIX(periodStart, periodEnd) }));
    this.selectedPeriod = period;
  }

  generateDoughnutChartData(spendingList: SpendingByCategoriesItem[]): ChartData<'doughnut'> {
    return {
      datasets: [
        {
          data: spendingList.map(item => item.totalAmount / 100),
          backgroundColor: spendingList.map(item => item.icon.background),
          borderColor: 'rgba(35, 40, 40, 0.5)',
          borderWidth: -1
        }
      ]
    }
  }
}
