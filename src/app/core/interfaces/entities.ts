import { SpendingModel, UserModel } from './models';

export interface SpendingEntity extends SpendingModel {
  userId: string;
}

export interface UserEntity extends UserModel {

}
