import { SortFieldEnum, DirectionEnum } from '../enums/spending.enums';
import { SpendingStatusEnum } from '../enums/spending-status.enum';

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
  availableMonoBankAccounts?: AvailableMonoBankAccounts;
  displayLanguage: string;
  categories: CategoryModel[];
}

export interface SpendingModel {
  id: string;
  bankId: string;
  amount: number;
  time: number;
  status: SpendingStatusEnum;
  category?: CategoryModel;
  categoryId?: string;
  description?: string;
  date?: string;
  currencyCode?: number;
  comment?: string;
  accountId?: string;
  accountType?: string;
  userId?: string;
  removalTime?: number;
}

export interface SpendingSortModel {
  field: SortFieldEnum;
  direction: DirectionEnum;
}

export interface MonoBankUserData {
  "clientId": string;
  "name": string;
  "webHookUrl": string;
  "permissions": string;
  "accounts": MonoBankAccount[];
}

export interface MonoBankAccount {
  currencyCode: number;
  id: string;
  maskedPan: string[];
  type: string;
}

export interface AvailableMonoBankAccounts {
  lastUpdateTime: number;
  availableAccounts: MonoBankAccount[];
}

export interface CategoryModel {
  id: string;
  name: string;
  icon: IconModel;
}

export interface SpendingByCategoriesItem extends CategoryModel {
  totalAmount: number;
  spendingList: SpendingModel[];
}

export interface TimePeriodModel {
  startDate: number;
  endDate: number;
}

export interface IconModel {
  iconType: string;
  background: string;
}

export interface GroupedSpendingModel {
  title: string;
  children: SpendingModel[];
}
