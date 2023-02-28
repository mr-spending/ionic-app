import * as moment from 'moment';

import { TimePeriodModel } from '../interfaces/models';
import { monthsList } from '../constants/time.constants';

export function getCurrentMonthPeriodUNIX(): TimePeriodModel {
  return {
    startDate: moment().startOf('month').unix(),
    endDate: moment().endOf('month').unix()
  };
}

export function getCustomPeriodUNIX(startTime: string, endTime: string): TimePeriodModel {
  return {
    startDate: moment(startTime).unix(),
    endDate: moment(endTime).unix()
  };
}

export function getAvailableMonthsInCurrentYear(): string[] {
  const numberOfCurrentMonth = Number(moment().format('MM'));
  return monthsList.filter((_, idx) => idx < numberOfCurrentMonth)
}
