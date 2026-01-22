import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ChartOverview } from '../../shared/chart-overview/chart-overview';
import { TransactionList } from '../transaction/transaction-list/transaction-list';
import { Modal } from '../../shared/modal/modal';
import { TransactionForm } from '../transaction/transaction-form/transaction-form';
import { SpinnerComponent } from '../../shared/spinner/spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { lucidePlus } from '@ng-icons/lucide';
import { TransactionType } from '../../shared/enums/transactions.enum';
import { ExpenseService } from './expense-service';
import { ExpenseDTO } from '../../shared/models/DTO/expense.dto';
import { Observable } from 'rxjs';
import { BaseTransactionComponent } from '../transaction/base-transaction/base-transaction';

@Component({
  selector: 'app-expense',
  imports: [
    NgIcon,
    ChartOverview,
    TransactionList,
    Modal,
    TransactionForm,
    SpinnerComponent,
    TranslatePipe,
  ],
  templateUrl: './expense.html',
  styleUrl: './expense.css',
  viewProviders: [provideIcons({ lucidePlus })],
})
export class Expense extends BaseTransactionComponent<ExpenseDTO> {
  protected TYPE = TransactionType.EXPENSE;
  protected expenseService = inject(ExpenseService);

  protected override filename: string = 'expense_details.xlsx';
  protected override categories = this.categoryService.getCategoryByType(this.TYPE);
  protected transactions = this.expenseService.getCurrentMonthExpenses();

  protected override addAction(data: ExpenseDTO): Observable<any> {
    return this.expenseService.addExpense(data);
  }

  protected override deleteAction(id: number): Observable<any> {
    return this.expenseService.deleteExpense(id);
  }

  protected override downloadAction(): Observable<Blob> {
    return this.expenseService.downloadExpenseExcel();
  }

  protected override emailAction(): Observable<any> {
    return this.expenseService.sendEmailWithExpenseExcel();
  }
}
