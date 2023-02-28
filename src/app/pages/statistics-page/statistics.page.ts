import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';
import { ChartData } from 'chart.js';
import * as moment from 'moment/moment';
import { FormBuilder, FormGroup } from '@angular/forms';

import { CategoryModel, SpendingByCategoriesItem } from '../../core/interfaces/models';
import { UserSelectors } from '../../core/state/selectors/user.selectors';
import { CategoriesSelectors } from '../../core/state/selectors/categories.selectors';
import { getAvailableMonthsInCurrentYear, getCustomPeriodUNIX } from '../../core/utils/time.utils';
import { SpendingActions } from '../../core/state/actions/spending.actions';
import { SpendingService } from '../../core/services/spending/spending.service';
import { SpendingSelectors } from '../../core/state/selectors/spending.selectors';

@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit, OnDestroy {
  formGroup: FormGroup;
  categoryList!: CategoryModel[];
  selectedPeriod!: 'week'| 'month'| 'year';

  subscription: Subscription = new Subscription();

  spendingByCategoriesList$: Observable<SpendingByCategoriesItem[]> = this.store.select(CategoriesSelectors.selectSpendingByCategories);
  totalAmount$: Observable<number> = this.store.select(SpendingSelectors.selectStatTotalAmount);
  currency$: Observable<string> = this.store.select(UserSelectors.selectCurrency);


  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    public spendingService : SpendingService,
  ) {
    this.formGroup = this.fb.group({
      monthControl: this.fb.control(''),
      yearControl: this.fb.control('')
    });
  }

  get monthControl() { return this.formGroup.controls['monthControl'] };

  get yearControl() { return this.formGroup.controls['yearControl'] };

  ngOnInit() {
    this.subscription.add(this.store.select(CategoriesSelectors.selectCategories)
      .subscribe((categories: CategoryModel[]) => this.categoryList = categories),
    );
    this.onPeriodSelect('month');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onPeriodSelect(period: 'week'| 'month'| 'year', subPeriod?: string): void {
    let periodStart = '';
    let periodEnd = '';

    if (subPeriod) {

    } else {
      periodStart = moment().startOf(period).format('YYYY-MM-DD');
      periodEnd = moment().endOf(period).format('YYYY-MM-DD');
    }

    console.log(periodStart, periodEnd)
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
