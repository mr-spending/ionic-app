import { SpendingModel, UserModel } from '../interfaces/models';
import { spendingKey, userKey } from './app.reducer';

export interface AppState {
  [spendingKey]: SpendingState;
  [userKey]: UserState;
}

export interface SpendingState {
  spendingList: SpendingModel[],
}

export interface UserState {
  userId: string,
  user: UserModel | null,
}
