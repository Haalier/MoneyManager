import { HttpClient, HttpContext } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { Expense } from '../../shared/models/expense.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ExpenseDTO } from '../../shared/models/DTO/expense.dto';
import { tap } from 'rxjs';
import { SKIP_LOADING } from '../../core/context/loading.context';
import { DashboardService } from '../home/dashboard-service';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private dashboardService = inject(DashboardService);
  private readonly http = inject(HttpClient);
  private readonly URL = 'https://moneymanager-1-vrgj.onrender.com/api/v1.0/expenses';
  private readonly DOWNLOAD_EXCEL_URL =
    'https://moneymanager-1-vrgj.onrender.com/api/v1.0/excel/download/expense';
  private readonly EMAIL_URL =
    'https://moneymanager-1-vrgj.onrender.com/api/v1.0/email/expense-excel';
  private readonly destroyRef = inject(DestroyRef);

  private expensesSignal = signal<Expense[] | null>(null);
  private totalExpensesSignal = signal<number | null>(null);

  public getCurrentMonthExpenses() {
    if (this.expensesSignal() === null) {
      this.http
        .get<Expense[]>(this.URL)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((expenses) => {
          this.expensesSignal.set(expenses);
        });
    }

    return this.expensesSignal.asReadonly();
  }

  public getTotalExpense() {
    if (this.totalExpensesSignal() === null) {
      this.http
        .get<number>(`${this.URL}/total`)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((total) => {
          this.totalExpensesSignal.set(total);
        });
    }

    return this.totalExpensesSignal.asReadonly();
  }

  public addExpense(newExpense: ExpenseDTO) {
    return this.http.post<Expense>(this.URL, newExpense).pipe(
      tap((data) => {
        this.dashboardService.refresh();
        if (this.expensesSignal() !== null) {
          this.expensesSignal.update((expenses) => [...(expenses || []), data]);
        }

        if (this.totalExpensesSignal() !== null) {
          this.totalExpensesSignal.update((total) => (total ?? 0) + Number(data.amount));
        }
      }),
      takeUntilDestroyed(this.destroyRef),
    );
  }

  public deleteExpense(expenseId: number) {
    return this.http.delete(`${this.URL}/${expenseId}`).pipe(
      tap(() => {
        this.dashboardService.refresh();
        const expenseToDelete = this.expensesSignal()?.find((e) => e.id === expenseId);

        if (this.expensesSignal() !== null) {
          this.expensesSignal.update((expenses) =>
            (expenses || [])?.filter((expense) => expense.id !== expenseId),
          );

          if (this.totalExpensesSignal() !== null && expenseToDelete) {
            this.totalExpensesSignal.update((total) => (total ?? 0) - expenseToDelete.amount);
          }
        }
      }),
      takeUntilDestroyed(this.destroyRef),
    );
  }

  public downloadExpenseExcel() {
    return this.http
      .get(this.DOWNLOAD_EXCEL_URL, {
        context: new HttpContext().set(SKIP_LOADING, true),
        responseType: 'blob',
      })
      .pipe(takeUntilDestroyed(this.destroyRef));
  }

  public sendEmailWithExpenseExcel() {
    return this.http
      .get(this.EMAIL_URL, { context: new HttpContext().set(SKIP_LOADING, true) })
      .pipe(takeUntilDestroyed(this.destroyRef));
  }
}
