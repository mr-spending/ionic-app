import * as moment from 'moment';

import { BankTransaction, MonoBankAccount } from '../interfaces/models';
import { DateFormatEnum } from '../enums/date-format.enums';

export function convertBankTransactionToModel(account: MonoBankAccount, list: any): BankTransaction[] {
  return list.filter((item: any) => item.amount < 0).map((item: any) => ({
    amount: Math.abs(item.amount),
    currencyCode: item.currencyCode,
    description: item.description,
    comment: item.comment,
    id: item.id,
    time: item.time,
    date: moment(item.time * 1000).format(DateFormatEnum.YYYY_MM_DD__HH_MM_SS),
    accountType: account.type,
    accountId: account.id
  }));
}
