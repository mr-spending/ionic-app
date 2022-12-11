export interface UserModel {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
}

export interface SpendingModel {
  id: string;
  amount: number;
  date: string;
  category: string;
  description?: string;
}
