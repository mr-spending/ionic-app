import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';
import { ChartData } from 'chart.js';
import * as moment from 'moment/moment';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { CategoryModel, SpendingByCategoriesItem } from '../../core/interfaces/models';
import { UserSelectors } from '../../core/state/selectors/user.selectors';
import { CategoriesSelectors } from '../../core/state/selectors/categories.selectors';
import {
  getAvailableMonthsInCurrentYear,
  getCurrentYear,
  getYearsFromToCurrent
} from '../../core/utils/time.utils';
import { SpendingActions } from '../../core/state/actions/spending.actions';
import { SpendingService } from '../../core/services/spending/spending.service';
import { SpendingSelectors } from '../../core/state/selectors/spending.selectors';
import { START_YEAR } from '../../core/constants/time.constants';

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
  availableYears = getYearsFromToCurrent(START_YEAR);

  spendingByCategoriesList$: Observable<SpendingByCategoriesItem[]> = this.store.select(CategoriesSelectors.selectSpendingByCategories);
  totalAmount$: Observable<number> = this.store.select(SpendingSelectors.selectStatTotalAmount);
  currency$: Observable<string> = this.store.select(UserSelectors.selectCurrency);
  periodFormGroup: FormGroup;
  periods = ['week', 'month', 'year'];

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    public spendingService : SpendingService,
  ) {

    this.periodFormGroup = this.fb.group({
      periodRange: this.fb.control(null)
    })
    this.formGroup = this.fb.group({
      monthControl: this.fb.control(this.availableMonthsInCurrentYear.slice(-1)[0]),
      yearControl: this.fb.control(this.availableYears.slice(-1)[0])
    });

    this.periodFormGroup.valueChanges.subscribe(period => {
      console.log(period);
      const value = period.periodRange;

      let startDate = 0;
      let endDate = 0;

      if (value === 'month') {
        startDate = moment().startOf('month').unix();
        endDate = moment().endOf('month').unix();
      } else if (period === 'year') {
        startDate = moment(String(this.yearControl.value)).startOf('year').unix();
        endDate = moment(String(this.yearControl.value)).endOf('year').unix();
      } else {
        startDate = moment().startOf(period).unix();
        endDate = moment().endOf(period).unix();
      }
      this.store.dispatch(SpendingActions.updateStatTimePeriod({ payload: { startDate, endDate } }))
      this.store.dispatch(SpendingActions.statSpendingList());
    });

    this.periodFormGroup.get('periodRange')?.setValue(this.periods[1]);
  }

  get monthControl() {
    console.log('hello Arthur')
    return this.formGroup.controls['monthControl'] as FormControl
  };

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

  onPeriodSelect(period: 'week'| 'month'| 'year'): void {
    let startDate = 0;
    let endDate = 0;

    if(period === 'month') {
      startDate = moment(`${ getCurrentYear() }-${ this.monthControl.value }`).startOf('month').unix();
      endDate = moment(`${ getCurrentYear() }-${ this.monthControl.value }`).endOf('month').unix();
    } else if (period === 'year') {
      startDate = moment(String(this.yearControl.value)).startOf('year').unix();
      endDate = moment(String(this.yearControl.value)).endOf('year').unix();
    } else {
    startDate = moment().startOf(period).unix();
    endDate = moment().endOf(period).unix();
    }

    // this.store.dispatch(SpendingActions.updateStatTimePeriod({ payload: { startDate, endDate } }))
    // this.store.dispatch(SpendingActions.statSpendingList());
    this.selectedPeriod = period;
  }

  generateDoughnutChartData(spendingList: SpendingByCategoriesItem[]): ChartData<'doughnut'> {
    return {
      datasets: [
        {
          data: spendingList.length ? spendingList.map(item => item.totalAmount / 100) : [0.001],
          backgroundColor: spendingList.length ? spendingList.map(item => item.icon.background) : '#8a8a8a',
          borderColor: 'rgba(35, 40, 40, 0.5)',
          borderWidth: -1
        }
      ]
    }
  }
}
