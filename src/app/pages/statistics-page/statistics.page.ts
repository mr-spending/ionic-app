import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';
import { ChartConfiguration, ChartData } from 'chart.js';
import { ChartEvent } from 'chart.js/auto';
import { BaseChartDirective } from 'ng2-charts';
import * as moment from 'moment/moment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import {
  CategoryModel,
  SpendingByCategoriesItem,
} from '../../core/interfaces/models';
import { UserSelectors } from '../../core/state/selectors/user.selectors';
import {
  getAvailableMonthsInCurrentYear,
  getCurrentYear,
  getYearsFromToCurrent,
} from '../../core/utils/time.utils';
import { SpendingActions } from '../../core/state/actions/spending.actions';
import { SpendingService } from '../../core/services/spending/spending.service';
import { SpendingSelectors } from '../../core/state/selectors/spending.selectors';
import { START_YEAR } from '../../core/constants/time.constants';
import { ViewPeriod } from '../../core/enums/time.enum';
import { DateFormatEnum } from '../../core/enums/date-format.enums';



@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  formGroup: FormGroup;
  selectedPeriod!: ViewPeriod;

  subscription: Subscription = new Subscription();
  availableMonthsInCurrentYear = getAvailableMonthsInCurrentYear();
  availableYears = getYearsFromToCurrent(START_YEAR);
  DateFormatEnum = DateFormatEnum;
  periods = Object.values(ViewPeriod);
  ViewPeriod = ViewPeriod;
  moment = moment;
  selectedCategory: CategoryModel | null = null;
  selectedCategoryIndex: number | null = null

  spendingByCategoriesList$: Observable<SpendingByCategoriesItem[]> =
    this.store.select(UserSelectors.selectSpendingByUserCategories);
  categoryList$: Observable<CategoryModel[] | undefined> = this.store.select(
    UserSelectors.selectUserCategories
  );
  totalAmount$: Observable<number> = this.store.select(
    SpendingSelectors.selectStatTotalAmount
  );
  categoryAmount$: Observable<number> | null = null;
  currency$: Observable<string> = this.store.select(
    UserSelectors.selectCurrency
  );

  chartOptions: ChartConfiguration<'doughnut'>['options'] = {
    cutout: '80%',
    animation: false,
    onClick: (event) => this.onChartClick(event), 
    events: ['click', 'touchstart'],
    interaction:{
      mode: 'nearest',
      intersect: true,
      includeInvisible: false
    },
    plugins: {
      tooltip: {
        enabled: false,
      },
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
  };

  constructor(
    private translateService: TranslateService,
    private fb: FormBuilder,
    private store: Store<AppState>,
    public spendingService: SpendingService
  ) {
    this.formGroup = this.fb.group({
      periodRange: this.fb.control(null),
      monthControl: this.fb.control(this.availableMonthsInCurrentYear.slice(-1)[0]),
      yearControl: this.fb.control(this.availableYears.slice(-1)[0]),
    });
  }

  ngOnInit() {
    this.setupFormGroup()
    this.formGroup.get('periodRange')?.setValue(ViewPeriod.Month);
  }

  ionViewWillEnter() {
    this.updateList();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  clearResult(){
    console.log('hi')
    this.selectedCategory = null;
    this.selectedCategoryIndex = null;
    this.categoryAmount$ = null;
  }

  generateDoughnutChartData(
    spendingList: SpendingByCategoriesItem[]
  ): ChartData<'doughnut'> {
    return {
      datasets: [
        {
          data: spendingList.length ? spendingList.map((item) => item?.totalAmount / 100) : [0.001],
          backgroundColor: spendingList.length ? spendingList.map((item) => item.icon.background) : '#8a8a8a',
          borderColor: spendingList.length ? spendingList.map((item, index) => {
                if (
                  (this.selectedCategory && this.selectedCategory.id === item.id) || 
                  index === this.selectedCategoryIndex
                ) {
                  return item.icon.background;
                }
                return 'rgba(35, 40, 40, 0.5)';
              }) : 'rgba(35, 40, 40, 0.5)',
          borderWidth: spendingList.length ? spendingList.map((item, index) => {
                if (
                  (this.selectedCategory && this.selectedCategory.id === item.id) || 
                  index === this.selectedCategoryIndex
                ) {
                  return 6;
                }
                return -1;
              }) : -1,
          spacing: 5,
          borderRadius: 2,
        },
      ],
    };
  }

  onChartClick(event: ChartEvent ) {
    if (event) {
      const chartInstance = this.chart!.chart;
      this.selectedCategory = null
      const activePoints = chartInstance!.getElementsAtEventForMode(
        event.native!,
        'nearest',
        { intersect: true },
        false
      );
      if (activePoints.length) {
        const firstPoint = activePoints[0];
        const index = firstPoint.index;
        if (this.selectedCategoryIndex != null || this.selectedCategoryIndex == index){
          this.selectedCategoryIndex = null
          this.categoryAmount$ = null;
        } else {
          this.selectedCategoryIndex = index
          this.subscription.add(this.spendingByCategoriesList$.subscribe(categories=>{
            this.categoryAmount$ = of(categories[index]?.totalAmount / 100)
          })) 
        }
      } else {
        this.selectedCategoryIndex = null
        this.categoryAmount$ = null;
      }
    }
  }

  onCategorySelect(category: CategoryModel, index: number) {
    if (this.selectedCategory?.id == category.id || this.selectedCategoryIndex == index) {
      this.selectedCategory = null;
      this.categoryAmount$ = null;
      this.selectedCategoryIndex = null;
    } else {
      this.selectedCategory = category;
      this.selectedCategoryIndex = index
      this.categoryAmount$ = this.store.select(
        SpendingSelectors.selectStatCategoryAmount(category.id)
      );
    }
  }

  updateList() {
    this.store.dispatch(SpendingActions.statSpendingList());
  }

  setupFormGroup(){
    this.subscription.add(
      this.formGroup.valueChanges.subscribe(
        ({ periodRange, monthControl, yearControl }) => {
          this.selectedPeriod = periodRange;
          let startDate = 0;
          let endDate = 0;
          if (periodRange === ViewPeriod.Month) {
            const currentMonth = this.translateService.instant('general.months.' + monthControl);
            if (currentMonth.includes('.')) {
              startDate = moment(getCurrentYear() + monthControl, DateFormatEnum.YYYYMMMM)
                .startOf(ViewPeriod.Month)
                .unix();
              endDate = moment(getCurrentYear() + monthControl, DateFormatEnum.YYYYMMMM)
                .endOf(ViewPeriod.Month)
                .unix();
            } else {
              startDate = moment(getCurrentYear() + this.translateService.instant('general.months.' + monthControl),
                DateFormatEnum.YYYYMMMM
              )
                .startOf(ViewPeriod.Month)
                .unix();
              endDate = moment(getCurrentYear() + this.translateService.instant('general.months.' + monthControl),
                DateFormatEnum.YYYYMMMM
              )
                .endOf(ViewPeriod.Month)
                .unix();
            }
          } else if (periodRange === ViewPeriod.Year) {
            startDate = moment(String(yearControl), DateFormatEnum.YYYY)
              .startOf(ViewPeriod.Year)
              .unix();
            endDate = moment(String(yearControl), DateFormatEnum.YYYY)
              .endOf(ViewPeriod.Year)
              .unix();
          } else {
            startDate = moment().startOf(periodRange).unix();
            endDate = moment().endOf(periodRange).unix();
          }

          this.store.dispatch(SpendingActions.updateStatTimePeriod({
              payload: { startDate, endDate },
            })
          );
          this.updateList();
        }
      )
    );
  }
}
