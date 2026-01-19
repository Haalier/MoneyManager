import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Income } from '../../models/income.model';
import { IncomeDTO } from '../../models/DTO/income.dto';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IncomeService {
  private readonly http = inject(HttpClient);
  private readonly URL = 'https://moneymanager-1-vrgj.onrender.com/api/v1.0/incomes';
  private readonly destroyRef = inject(DestroyRef);

  private incomesSignal = signal<Income[] | null>(null);
  private totalIncomesSignal = signal<number | null>(null);

  public getCurrentMonthIncomes() {
    if (this.incomesSignal() === null) {
      this.http
        .get<Income[]>(`${this.URL}`)
        .pipe(takeUntilDestroyed(this.destroyRef))
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
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((incomes) => {
          this.totalIncomesSignal.set(incomes);
        });
    }
    return this.totalIncomesSignal.asReadonly();
  }

  public addIncome(newIncome: IncomeDTO) {
    return this.http.post<Income>(this.URL, newIncome).pipe(
      tap((data) => {
        if (this.incomesSignal() !== null) {
          this.incomesSignal.update((incomes) => [...(incomes || []), data]);
        }

        if (this.totalIncomesSignal() !== null) {
          this.totalIncomesSignal.update((total) => (total || 0) + Number(data.amount));
        }
      }),
      takeUntilDestroyed(this.destroyRef),
    );
  }

  public deleteIncome(incomeId: number) {
    return this.http.delete(`${this.URL}/${incomeId}`).pipe(
      tap(() => {
        const incomeToDelete = this.incomesSignal()?.find((i) => i.id === incomeId);

        if (this.incomesSignal() !== null) {
          this.incomesSignal.update((incomes) =>
            (incomes || []).filter((income) => income.id !== incomeId),
          );
        }

        if (this.totalIncomesSignal() !== null && incomeToDelete) {
          this.totalIncomesSignal.update((total) => (total ?? 0) - incomeToDelete.amount);
        }
      }),
      takeUntilDestroyed(this.destroyRef),
    );
  }
}
