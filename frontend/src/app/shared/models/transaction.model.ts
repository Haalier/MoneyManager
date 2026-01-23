import { TransactionType } from '../enums/transactions.enum';

export interface Transaction {
  id: number;
  amount: number;
  date: string;
  icon: string;
  name: string;
  profileId: number;
  type: TransactionType;
  createdAt: string;
  updatedAt: string;
}
