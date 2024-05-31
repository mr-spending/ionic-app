import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment/moment';
import { TranslateService } from '@ngx-translate/core';
import { DateFormatEnum } from '../../core/enums/date-format.enums';

@Pipe({
  name: 'MrSpendingListDateFormatPipe'
})
export class MrSpendingListDateFormatPipe implements PipeTransform {

  constructor(private translateService: TranslateService) { }

  transform(date: string): string {
    const dateToday = moment().format(DateFormatEnum.YYYY_MM_DD);
    const dateYesterday = moment().subtract(1, 'days').format(DateFormatEnum.YYYY_MM_DD);
    let currentValue = moment(date).format(DateFormatEnum.DD__MMMM__YYYY);
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
