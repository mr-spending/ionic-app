import * as moment from 'moment';

import { GroupedSpendingModel, SpendingModel } from '../interfaces/models';
import { DateFormatEnum } from '../enums/date-format.enums';

export function mapSpendingList(list: SpendingModel[]): SpendingModel[] {
  return list.map(item => ({
    ...item,
    date: moment(item.time * 1000).format(DateFormatEnum.YYYY_MM_DD__HH_MM_SS)
  }))
}

export function groupingSpendingByDate(list: SpendingModel[]): GroupedSpendingModel[] {
  const groupedList: GroupedSpendingModel[] = [];

  list.forEach(spending => {
    const spendingDate = moment(spending.time * 1000).format('YYYY-MM-DD');
    const dateIDX = groupedList.findIndex(item => item.title === spendingDate);

    dateIDX >= 0
      ? groupedList[dateIDX].children.push({ ...spending, date: spendingDate })
      : groupedList.push({ title: spendingDate, children: [{ ...spending, date: spendingDate }] })
  })

  return groupedList;
}
