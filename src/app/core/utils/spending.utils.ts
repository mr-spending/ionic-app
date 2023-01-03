import { SpendingModel } from '../interfaces/models';
import * as moment from 'moment';
import { DateFormatEnum } from '../enums/date-format.enums';

export function mapSpendingList(list: SpendingModel[]): SpendingModel[] {
  return list.map(item => ({
    ...item,
    date: moment(item.time * 1000).format(DateFormatEnum.YYYY_MM_DD__HH_MM_SS)
  }))
}
