import { SpendingDto } from '../dto/spending.dto';

export interface SpendingEntity extends SpendingDto {
  uid: string;
}
