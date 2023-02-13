import * as moment from 'moment';

import { BankTransaction, MonoBankAccount } from '../interfaces/models';
import { DateFormatEnum } from '../enums/date-format.enums';
import { CurrencyCodesEnum } from '../enums/сurrency.enums';

export function convertBankTransactionToModel(accounts: MonoBankAccount[], list: any): BankTransaction[] {
  return list.map((item: any) => {
    const statementItem = item.data.statementItem
    return {
      amount: Math.abs(statementItem.amount),
      currencyCode: statementItem.currencyCode,
      description: statementItem.description,
      comment: statementItem.comment,
      id: statementItem.id,
      time: statementItem.time,
      date: moment(statementItem.time * 1000).format(DateFormatEnum.YYYY_MM_DD__HH_MM_SS),
      accountType: accounts.find(acc => acc.id === item.data.account)?.type,
      accountId: item.data.account
    }}
  );
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
