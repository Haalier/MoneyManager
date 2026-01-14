import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../../models/category.model';
import { CategoryEnum } from './CategoryEnum';
import { finalize, of, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly URL = 'https://moneymanager-1-vrgj.onrender.com/api/v1.0/categories';
  private categoriesSignal = signal<Category[] | null>(null);
  private isLoadingSignal = signal<boolean>(false);

  public categories = this.categoriesSignal.asReadonly();
  public isLoading = this.isLoadingSignal.asReadonly();

  public getCategories() {
    if (this.categoriesSignal() !== null) return;
    this.refreshCategories();
  }

  private refreshCategories() {
    this.isLoadingSignal.set(true);
    this.http
      .get<Category[]>(this.URL)
      .pipe(finalize(() => this.isLoadingSignal.set(false)))
      .subscribe((cat) => {
        this.categoriesSignal.set(cat);
      });
  }

  public addCategory(newCategory: Partial<Category>) {
    return this.http.post<Category>(this.URL, newCategory).pipe(
      tap((addedCategory) => {
        this.categoriesSignal.update((cats) => [...(cats ?? []), addedCategory]);
      }),
    );
  }

  public updateCategory(categoryId: number, category: Partial<Category>) {
    return this.http.put<Category>(`${this.URL}/${categoryId}`, category).pipe(
      tap((updatedCategory) => {
        this.categoriesSignal.update((cats) => {
          if (!cats) return [];

          return cats?.map((cat) => (cat.id === categoryId ? updatedCategory : cat));
        });
      }),
    );
  }

  public getCategoryByType(categoryType: CategoryEnum) {
    return this.http.get<Category[]>(`${this.URL}/${categoryType}`);
  }
}
