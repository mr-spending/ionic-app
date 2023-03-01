import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';
import { ChartData } from 'chart.js';
import * as moment from 'moment/moment';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { CategoryModel, SpendingByCategoriesItem, TimePeriodModel } from '../../core/interfaces/models';
import { UserSelectors } from '../../core/state/selectors/user.selectors';
import { CategoriesSelectors } from '../../core/state/selectors/categories.selectors';
import {
  getAvailableMonthsInCurrentYear,
  getCurrentYear,
  getCustomPeriodUNIX,
  getYearsFromToCurrent
} from '../../core/utils/time.utils';
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
  availableMonthsInCurrentYear = getAvailableMonthsInCurrentYear();
  availableYears = getYearsFromToCurrent(2023);

  spendingByCategoriesList$: Observable<SpendingByCategoriesItem[]> = this.store.select(CategoriesSelectors.selectSpendingByCategories);
  totalAmount$: Observable<number> = this.store.select(SpendingSelectors.selectStatTotalAmount);
  currency$: Observable<string> = this.store.select(UserSelectors.selectCurrency);

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    public spendingService : SpendingService,
  ) {
    this.formGroup = this.fb.group({
      monthControl: this.fb.control(this.availableMonthsInCurrentYear.slice(-1)[0]),
      yearControl: this.fb.control(this.availableYears.slice(-1)[0])
    });
  }

  get monthControl() { return this.formGroup.controls['monthControl'] as FormControl };

  get yearControl() { return this.formGroup.controls['yearControl'] as FormControl };

  ngOnInit() {
    this.subscription.add(this.store.select(CategoriesSelectors.selectCategories)
      .subscribe((categories: CategoryModel[]) => this.categoryList = categories),
    );
    this.onPeriodSelect('month');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onPeriodSelect(period: 'week'| 'month'| 'year', subPeriod?: string | number): void {
    let startDate = 0;
    let endDate = 0;

    if (subPeriod) {
      if(period === 'month') {
        startDate = moment(`${ getCurrentYear() }-${ subPeriod }`).startOf('month').unix();
        endDate = moment(`${ getCurrentYear() }-${ subPeriod }`).endOf('month').unix();
      } else if (period === 'year') {
        startDate = moment(String(subPeriod)).startOf('year').unix();
        endDate = moment(String(subPeriod)).endOf('year').unix();
      }
    } else {
      startDate = moment().startOf(period).unix();
      endDate = moment().endOf(period).unix();
    }

    this.store.dispatch(SpendingActions.updateStatTimePeriod({ payload: { startDate, endDate } }))
    this.store.dispatch(SpendingActions.statSpendingList());
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
