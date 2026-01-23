import { TransactionType } from '../../enums/transactions.enum';

type sortFields = 'amount' | 'date' | 'category';
type sortOrders = 'asc' | 'desc';

export interface FilterDTO {
  type: TransactionType;
  sortField: sortFields;
  sortOrder: sortOrders;
  startDate: string | null;
  endDate: string | null;
  keyword: string | null;
}
