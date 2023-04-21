import { createFeatureSelector } from '@ngrx/store';

import { bankAccountsKey, BankAccountsState } from '../reducers/bank-accounts.reducer';

const bankAccountsSelector = createFeatureSelector<BankAccountsState>(bankAccountsKey);

export namespace BankAccountsSelectors { }
