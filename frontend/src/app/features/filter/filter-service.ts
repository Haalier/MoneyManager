import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { FilterDTO } from '../../shared/models/DTO/filter.dto';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FilterData } from '../../shared/models/filterData.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private URL = 'https://moneymanager-1-vrgj.onrender.com/api/v1.0/filter';
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  private transactionSignal = signal<FilterData | null>(null);
  public transactions = this.transactionSignal.asReadonly();

  public addFilters(filters: FilterDTO) {
    return this.http.post<FilterData>(this.URL, filters).pipe(
      tap((res) => {
        this.transactionSignal.set(res);
      }),
      takeUntilDestroyed(this.destroyRef),
    );
  }
}
