import { SortFieldEnum, DirectionEnum } from '../enums/spending.enums';

export interface UserModel {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
  currency?: string;
  monoBankClientToken?: string;
  monoBankAccounts?: MonoBankAccount[];
}

export interface SpendingModel {
  id: string;
  amount: number;
  time: number;
  category: string;
  description?: string;
  date?: string;
}

export interface SpendingSortModel {
  field: SortFieldEnum;
  direction: DirectionEnum;
}

export interface MonoBankAccount {
  currencyCode: number;
  id: string;
  maskedPan: string[];
  type: string;
}

export interface BankAccountTransaction {
  amount: number;
  currencyCode: number;
  description?: string;
  comment?: string;
  id: string;
  time: number;
  date?: string;
}
