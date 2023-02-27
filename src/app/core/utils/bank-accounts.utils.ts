import * as moment from 'moment';

import { BankTransaction, MonoBankAccount, MonoBankUserData, ServerBankTransaction } from '../interfaces/models';
import { DateFormatEnum } from '../enums/date-format.enums';
import { CurrencyCodesEnum } from '../enums/сurrency.enums';
import { MonoCardsEnum } from '../enums/mono-cards.enum';

export function convertBankTransactionToModel(accounts: MonoBankAccount[], list: ServerBankTransaction[]): BankTransaction[] {
  return list.map(item => {
    const statementItem = item.data.statementItem
    return {
      amount: Math.abs(statementItem.amount),
      currencyCode: statementItem.currencyCode,
      description: statementItem.description,
      id: statementItem.id,
      time: statementItem.time,
      date: moment(statementItem.time * 1000).format(DateFormatEnum.YYYY_MM_DD__HH_MM_SS),
      accountType: accounts.find(acc => acc.id === item.data.account)!.type,
      accountId: item.data.account
    } as unknown as BankTransaction }
  );
}

export function configureMonoCardsList(payload: MonoBankUserData): MonoBankAccount[] {
  return payload.accounts.map(account => ({
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
    return bankTransactions.filter(item => item.currencyCode === currencyCode && item.type !== MonoCardsEnum.FOP);
}
