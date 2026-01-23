import { Expense } from './expense.model';
import { FilterData } from './filterData.model';
import { Income } from './income.model';
import { Transaction } from './transaction.model';

export interface DashboardData {
  recentFiveExpenses: Expense[];
  recentFiveIncomes: Income[];
  recentTransactions: Transaction[];
  totalBalance: number;
  totalExpense: number;
  totalIncome: number;
}
