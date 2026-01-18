import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Income } from '../../models/income.model';
import { catchError, EMPTY } from 'rxjs';
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

  public getCurrentMonthIncomes() {
    if (this.incomesSignal() === null) {
      this.http
        .get<Income[]>(`${this.URL}`)
        .pipe(
          catchError((error) => {
            this.toast.error(error.response?.data?.message || 'Failed to load incomes');
            return EMPTY;
          }),
        )
        .subscribe((incomes) => {
          this.incomesSignal.set(incomes);
        });
    }

    return this.incomesSignal.asReadonly();
  }

  public getTotalIncome() {
    if (this.totalIncomesSignal() === null) {
      this.http
        .get<number>(`${this.URL}/total`)
        .pipe(
          catchError((error) => {
            this.toast.error(error.response?.data?.message || 'Failed to load incomes');
            return EMPTY;
          }),
        )
        .subscribe((incomes) => {
          this.totalIncomesSignal.set(incomes);
        });
    }

    return this.totalIncomesSignal.asReadonly();
  }
}
