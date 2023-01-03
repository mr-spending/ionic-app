import * as moment from 'moment/moment';

import { BankAccountTransaction } from '../interfaces/models';
import { DateFormatEnum } from '../enums/date-format.enums';

export function convertBankTransactionToModel(list: any): BankAccountTransaction[] {
  return list.map((item: any) => ({
    amount: Math.abs(item.amount),
    currencyCode: item.currencyCode,
    description: item.description,
    comment: item.comment,
    id: item.id,
    time: item.time,
    date: moment(item.time * 1000).format(DateFormatEnum.YYYY_MM_DD__HH_MM_SS)
  }));
}
