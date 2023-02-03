import { Component, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-select-month-year-modal',
  templateUrl: './select-month-year-modal.component.html',
  styleUrls: ['./select-month-year-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SelectMonthYearModalComponent {
  startValue = moment().endOf('month').format('YYYY-MM');
  value = this.startValue;

  constructor(private modalCtrl: ModalController) { }

  selectChange(event: any) {
    this.value = event.detail.value.slice(0, 7);
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.value, 'confirm');
  }
}
