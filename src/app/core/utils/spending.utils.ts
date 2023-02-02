import * as moment from 'moment';

import { SpendingModel } from '../interfaces/models';
import { DateFormatEnum } from '../enums/date-format.enums';

export function mapSpendingList(list: SpendingModel[]): SpendingModel[] {
  return list.map(item => ({
    ...item,
    date: moment(item.time * 1000).format(DateFormatEnum.YYYY_MM_DD__HH_MM_SS)
  }))
}

export function groupingSpendingByDate(list: SpendingModel[]) {
  const groupedList: SpendingModel[][] = [];

  list.forEach(spending => {
    const spendingDate = spending.date?.split(' ')[0];
    const dateIDX = groupedList.findIndex(item => item[0].date?.split(' ')[0] === spendingDate);

    dateIDX >= 0
      ? groupedList[dateIDX].push({ ...spending, date: spendingDate })
      : groupedList.push([{ ...spending, date: spendingDate }])
  })

  return groupedList;
}
