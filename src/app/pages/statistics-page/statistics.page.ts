import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';
import { ModalController } from '@ionic/angular';

import { SpendingByCategoriesItem } from '../../core/interfaces/models';
import { UserSelectors } from '../../core/state/selectors/user.selectors';
import { CategoriesSelectors } from '../../core/state/selectors/categories.selectors';
import { SelectMonthYearModalComponent } from '../select-month-year-modal/select-month-year-modal.component';
import { getCurrentMonthPeriodUNIX, getCustomPeriodUNIX } from '../../core/utils/time.utils';

@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage {
  spendingByCategoriesList$: Observable<SpendingByCategoriesItem[]> = this.store.select(CategoriesSelectors.selectSpendingByCategories);
  currency$: Observable<string> = this.store.select(UserSelectors.selectCurrency);

  statisticsPeriod: 'currentMonth' | 'selectPeriod' = 'currentMonth';
  startDate = '';
  endDate = '';

  constructor(
    private store: Store<AppState>,
    private modalCtrl: ModalController,
  ) {
    this.getSpendingByCurrentMonth();
  }

  changeStatisticsPeriod(event: any) {
    this.statisticsPeriod = event.currentTarget.id;
    this.startDate = '';
    this.endDate = '';
    if (this.statisticsPeriod === 'currentMonth') this.getSpendingByCurrentMonth();
  }

  getSpendingByCurrentMonth() {
    const period = getCurrentMonthPeriodUNIX();
    console.log('Call#1 // ','start: ', period.startDate, '//', 'end: ', period.endDate);
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
    if (this.startDate && this.endDate) console.log('Call#2 // ','start: ', period.startDate, '//', 'end: ', period.endDate);
  }
}
