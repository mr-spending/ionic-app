import { CategoryModel, SpendingModel, UserModel } from './models';

export interface SpendingDto extends SpendingModel {
  userId: string;
}

export interface UserDto extends UserModel {

}

export interface CategoryDto extends CategoryModel {

}
