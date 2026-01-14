import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Income } from '../../models/income.model';

@Injectable({
  providedIn: 'root',
})
export class IncomeService {
  private readonly http = inject(HttpClient);
  private readonly URL = 'https://moneymanager-1-vrgj.onrender.com/api/v1.0/incomes';
  private incomesSignal = signal<Income[] | null>(null);

  public getAllIncomes() {
    if (this.incomesSignal() !== null) return;
    this.refreshIncomes();
  }

  private refreshIncomes() {
    return this.http.get<Income>(`${this.URL}/total`);
  }
}
