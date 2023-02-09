import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment/moment';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'MrSpendingListDateFormatPipe'
})
export class MrSpendingListDateFormatPipe implements PipeTransform {

  constructor(private translateService: TranslateService) { }

  transform(date: string): string {
    const dateToday = moment().format('YYYY-MM-DD');
    const dateYesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
    let currentValue = moment(date).format('DD MMMM YYYY');
    switch (date) {
      case dateToday:
        currentValue = `${this.translateService.instant('general.dates.today')}`;
        break;
      case dateYesterday:
        currentValue = `${this.translateService.instant('general.dates.yesterday')}`;
    }
    return currentValue;
  }
}
