import { SortFieldEnum, DirectionEnum } from '../enums/spending.enums';

export interface UserModel {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
  currency?: string;
  currencyId?: string;
  monoBankClientToken?: string;
  monoBankAccounts?: MonoBankAccount[];
}

export interface SpendingModel {
  id: string;
  amount: number;
  time: number;
  category?: CategoryModel;
  categoryId?: string;
  description?: string;
  date?: string;
  currencyCode?: number;
  comment?: string;
  accountId?: string;
  accountType?: string;
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

export interface BankTransaction {
  amount: number;
  currencyCode: number;
  description?: string;
  comment?: string;
  id: string;
  time: number;
  date?: string;
  accountId: string;
  accountType: string;
}

export interface CategoryModel {
  id: string;
  name: string;
  icon: CategoryIconModel;
}

export interface SpendingByCategoriesItem extends CategoryModel {
  totalAmount: number;
  spendingList: SpendingModel[];
}

export interface TimePeriodModel {
  startDate: number;
  endDate: number;
}

export interface CategoryIconModel {
  iconType: string;
  background: string;
}
