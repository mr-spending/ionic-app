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
import {
  getAvailableMonthsInCurrentYear,
  getCurrentYear,
  getYearsFromToCurrent
} from '../../core/utils/time.utils';
import { SpendingActions } from '../../core/state/actions/spending.actions';
import { SpendingService } from '../../core/services/spending/spending.service';
import { SpendingSelectors } from '../../core/state/selectors/spending.selectors';
import { START_YEAR } from '../../core/constants/time.constants';
import { ViewPeriod } from '../../core/enums/time.enum';

@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit, OnDestroy {
  formGroup: FormGroup;
  selectedPeriod!: ViewPeriod;

  subscription: Subscription = new Subscription();
  availableMonthsInCurrentYear = getAvailableMonthsInCurrentYear();
  availableYears = getYearsFromToCurrent(START_YEAR);
  periods = Object.values(ViewPeriod);
  ViewPeriod = ViewPeriod;

  spendingByCategoriesList$: Observable<SpendingByCategoriesItem[]> = this.store.select(CategoriesSelectors.selectSpendingByCategories);
  categoryList$: Observable<CategoryModel[]> = this.store.select(CategoriesSelectors.selectCategories);
  totalAmount$: Observable<number> = this.store.select(SpendingSelectors.selectStatTotalAmount);
  currency$: Observable<string> = this.store.select(UserSelectors.selectCurrency);

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    public spendingService : SpendingService,
  ) {
    this.formGroup = this.fb.group({
      periodRange: this.fb.control(null),
      monthControl: this.fb.control(this.availableMonthsInCurrentYear.slice(-1)[0]),
      yearControl: this.fb.control(this.availableYears.slice(-1)[0])
    });
  }

  ngOnInit() {
    this.subscription.add(this.formGroup.valueChanges
      .subscribe(({ periodRange, monthControl, yearControl }) => {
        this.selectedPeriod = periodRange;
        let startDate = 0;
        let endDate = 0;

        if (periodRange === ViewPeriod.Month) {
          startDate = moment(getCurrentYear() + monthControl, 'YYYYMMMM').startOf(ViewPeriod.Month).unix();
          endDate = moment(getCurrentYear() + monthControl, 'YYYYMMMM').endOf(ViewPeriod.Month).unix();
        } else if (periodRange === ViewPeriod.Year) {
          startDate = moment(String(yearControl), 'YYYY').startOf(ViewPeriod.Year).unix();
          endDate = moment(String(yearControl), 'YYYY').endOf(ViewPeriod.Year).unix();
        } else {
          startDate = moment().startOf(periodRange).unix();
          endDate = moment().endOf(periodRange).unix();
        }

        this.store.dispatch(SpendingActions.updateStatTimePeriod({ payload: { startDate, endDate } }))
        this.store.dispatch(SpendingActions.statSpendingList());
      })
    );
    this.formGroup.get('periodRange')?.setValue(ViewPeriod.Month);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
