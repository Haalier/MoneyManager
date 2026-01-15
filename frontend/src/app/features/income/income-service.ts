import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Income } from '../../models/income.model';
import { catchError, EMPTY, finalize } from 'rxjs';
import { HotToastService } from '@ngxpert/hot-toast';

@Injectable({
  providedIn: 'root',
})
export class IncomeService {
  private readonly http = inject(HttpClient);
  private readonly URL = 'https://moneymanager-1-vrgj.onrender.com/api/v1.0/incomes';
  private toast = inject(HotToastService);
  private incomesSignal = signal<Income[] | null>(null);
  private totalIncomesSignal = signal<number | null>(null);
  private isLoadingSignal = signal<boolean>(false);

  public incomes = this.incomesSignal.asReadonly();
  public totalIncomes = this.totalIncomesSignal.asReadonly();
  public isLoading = this.isLoadingSignal.asReadonly();

  public getCurrentMonthIncomes() {
    if (this.incomesSignal() !== null) return;
    this.refreshIncomes();
  }

  private refreshIncomes() {
    this.isLoadingSignal.set(true);
    this.http
      .get<Income[]>(`${this.URL}`)
      .pipe(
        catchError((error) => {
          this.toast.error(error.response?.data?.message || 'Failed to load incomes');
          return EMPTY;
        }),
        finalize(() => {
          this.isLoadingSignal.set(false);
        }),
      )
      .subscribe((incomes) => {
        this.incomesSignal.set(incomes);
      });
  }

  public getTotalIncome() {
    if (this.totalIncomesSignal() !== null) return;
    this.refreshTotalIncomes();
  }

  private refreshTotalIncomes() {
    this.isLoadingSignal.set(true);
    this.http
      .get<number>(`${this.URL}/total`)
      .pipe(
        catchError((error) => {
          this.toast.error(error.response?.data?.message || 'Failed to load incomes');
          return EMPTY;
        }),
        finalize(() => {
          this.isLoadingSignal.set(false);
        }),
      )
      .subscribe((incomes) => {
        this.totalIncomesSignal.set(incomes);
      });
  }
}
