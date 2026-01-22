export interface Expense {
  id: number;
  name: string;
  icon: string;
  categoryName: string;
  categoryId: number;
  amount: number;
  date: string;
  createdAt: Date;
  updatedAt: Date;
}
