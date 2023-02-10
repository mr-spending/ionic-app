import * as moment from 'moment';

import { BankTransaction, MonoBankAccount } from '../interfaces/models';
import { DateFormatEnum } from '../enums/date-format.enums';
import { CurrencyCodesEnum } from '../enums/сurrency.enums';

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

export function configureMonoCardsList(payload: any): MonoBankAccount[] {
  return payload.accounts.map((account: { currencyCode: any; id: any; maskedPan: any; type: any; }) => ({
    currencyCode: account.currencyCode,
    id: account.id,
    maskedPan: account.maskedPan,
    type: account.type,
  }));
}

export function filterBankTransactionsByCurrencyCode(
    bankTransactions: MonoBankAccount[],
    currencyCode: CurrencyCodesEnum
  ): MonoBankAccount[] {
    return bankTransactions.filter(item => item.currencyCode === currencyCode && item.type != 'fop');
}
