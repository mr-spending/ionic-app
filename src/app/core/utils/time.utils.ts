import * as moment from 'moment';

import { TimePeriodModel } from '../interfaces/models';

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
