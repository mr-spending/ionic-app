import * as moment from 'moment';

import { TimePeriodModel } from '../interfaces/models';
import { MONTHS_LIST } from '../constants/time.constants';
import { DateFormatEnum } from '../enums/date-format.enums';

export function getCurrentMonthPeriodUNIX(): TimePeriodModel {
  return {
    startDate: moment().startOf('month').unix(),
    endDate: moment().endOf('month').unix()
  };
}

export function getMonthPeriodCurrentMonthMinusValueUNIX(numMonths: number): TimePeriodModel {
  return {
    startDate: moment().subtract(numMonths, 'months').startOf('month').unix(),
    endDate: moment().endOf('month').unix()
  };
}

export function getAvailableMonthsInCurrentYear(): string[] {
  const numberOfCurrentMonth = Number(moment().format(DateFormatEnum.MM));
  return MONTHS_LIST.filter((_, idx) => idx < numberOfCurrentMonth);
}

export function getYearsFromToCurrent(from: number): number[] {
  const yearsList = [];
  for (let i = from; i <= getCurrentYear(); i++ ) yearsList.push(i);
  return yearsList;
}

export function getCurrentYear(): number {
  return Number(moment().format(DateFormatEnum.YYYY));
}
