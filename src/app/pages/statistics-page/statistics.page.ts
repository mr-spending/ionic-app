import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';
import { ModalController } from '@ionic/angular';
import { ChartData } from 'chart.js';

import { CategoryModel, SpendingByCategoriesItem } from '../../core/interfaces/models';
import { UserSelectors } from '../../core/state/selectors/user.selectors';
import { CategoriesSelectors } from '../../core/state/selectors/categories.selectors';
import { SelectMonthYearModalComponent } from '../../shared/components/select-month-year-modal/select-month-year-modal.component';
import { getCurrentMonthPeriodUNIX, getCustomPeriodUNIX } from '../../core/utils/time.utils';
import { SpendingActions } from '../../core/state/actions/spending.actions';
import { SpendingService } from '../../core/services/spending/spending.service';

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

  statisticsPeriod: 'currentMonth' | 'selectPeriod' = 'currentMonth';
  startDate = '';
  endDate = '';
  isDoughnutChartRepaintNeed: boolean = true;

  constructor(
    private store: Store<AppState>,
    private modalCtrl: ModalController,
    public spendingService : SpendingService,
  ) { }

  ngOnInit() {
    this.subscription.add(this.store.select(CategoriesSelectors.selectCategories)
      .subscribe((categories: CategoryModel[]) => this.categoryList = categories),
    );
    this.getSpendingByCurrentMonth();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  changeStatisticsPeriod(event: any) {
    this.statisticsPeriod = event.currentTarget.id;
    this.startDate = '';
    this.endDate = '';
    if (this.statisticsPeriod === 'currentMonth') this.getSpendingByCurrentMonth();
  }

  getSpendingByCurrentMonth() {
    this.store.dispatch(SpendingActions.statSpendingList({ payload: getCurrentMonthPeriodUNIX() }));
  }

  async selectDate(target: 'startDate' | 'endDate') {
    const modal = await this.modalCtrl.create({
      component: SelectMonthYearModalComponent,
      cssClass: 'select-month-year-modal',
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') this[target] = data;
    const period = getCustomPeriodUNIX(this.startDate, this.endDate);
    if (period.startDate >= period.endDate) this.startDate = '';
    if (this.startDate && this.endDate) this.store.dispatch(SpendingActions.statSpendingList({ payload: period }));
  }

  generateDoughnutChartData(spendingList: SpendingByCategoriesItem[]): ChartData<'doughnut'> {
    return {
      datasets: [
        {
          data: spendingList.map(item => item.totalAmount / 100),
          backgroundColor: spendingList.map(item => item.icon.background),
          borderWidth: 0
        }
      ]
    }
  }
}
