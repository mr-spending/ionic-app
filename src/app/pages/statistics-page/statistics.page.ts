import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';

import { SpendingByCategoriesItem } from '../../core/interfaces/models';
import { UserSelectors } from '../../core/state/selectors/user.selectors';
import { CategoriesSelectors } from '../../core/state/selectors/categories.selectors';
import { SelectMonthYearModalComponent } from '../select-month-year-modal/select-month-year-modal.component';

@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {
  spendingByCategoriesList$: Observable<SpendingByCategoriesItem[]> = this.store.select(CategoriesSelectors.selectSpendingByCategories);
  currency$: Observable<string> = this.store.select(UserSelectors.selectCurrency);

  statisticsPeriod: 'currentMonth' | 'selectPeriod' = 'currentMonth';
  startDane = '';
  endDate = '';

  constructor(
    private store: Store<AppState>,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() { }

  changeStatisticsPeriod(event: any) {
    this.statisticsPeriod = event.currentTarget.id;
    this.startDane = '';
    this.endDate = '';
    if (event.currentTarget.id === 'currentMonth') {
      const startDaneUNIX = moment().startOf('month').unix();
      const endDateUNIX = moment().endOf('month').unix();
      console.log('Call#1 // ','start: ', startDaneUNIX, '//', 'end: ', endDateUNIX);
    }
  }

  async selectDate(target: 'startDane' | 'endDate') {
    const modal = await this.modalCtrl.create({
      component: SelectMonthYearModalComponent,
      cssClass: 'select-month-year-modal',
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') this[target] = data;
    const startDaneUNIX = moment(this.startDane).startOf('month').unix();
    const endDateUNIX = moment(this.endDate).endOf('month').unix();
    if (startDaneUNIX >= endDateUNIX) this.startDane = '';
    if (this.startDane && this.endDate) console.log('Call#2 // ','start: ', startDaneUNIX, '//', 'end: ', endDateUNIX);
  }
}
