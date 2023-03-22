import { MonoBankAccount, MonoBankUserData } from '../interfaces/models';
import { CurrencyCodesEnum } from '../enums/сurrency.enums';
import { MonoCardsEnum } from '../enums/mono-cards.enum';

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
