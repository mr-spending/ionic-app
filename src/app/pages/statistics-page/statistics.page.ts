import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';
import { ModalController } from "@ionic/angular";

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
  }

  async selectDate(target: 'startDane' | 'endDate') {
    const modal = await this.modalCtrl.create({
      component: SelectMonthYearModalComponent,
      backdropDismiss: false,
      cssClass: 'select-month-year-modal',
    });

    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this[target] = data;
    }
  }
}
