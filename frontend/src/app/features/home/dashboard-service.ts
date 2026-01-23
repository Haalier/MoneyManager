import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DashboardData } from '../../shared/models/dashboardData.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private URL = 'https://moneymanager-1-vrgj.onrender.com/api/v1.0/dashboard';
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  private dashboardDataSignal = signal<DashboardData | null>(null);

  getDashboardData() {
    if (this.dashboardDataSignal() === null) {
      this.http
        .get<DashboardData>(this.URL)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((res) => this.dashboardDataSignal.set(res));
    }

    return this.dashboardDataSignal.asReadonly();
  }
}
