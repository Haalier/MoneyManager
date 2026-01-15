import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../../models/category.model';
import { CategoryEnum } from './CategoryEnum';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly URL = 'https://moneymanager-1-vrgj.onrender.com/api/v1.0/categories';
  private categoriesSignal = signal<Category[] | null>(null);
  private destroyRef = inject(DestroyRef);

  public categories = this.categoriesSignal.asReadonly();

  public getCategories() {
    if (this.categoriesSignal() !== null) return;
    this.refreshCategories();
  }

  private refreshCategories() {
    this.http
      .get<Category[]>(this.URL)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((cat) => {
        this.categoriesSignal.set(cat);
      });
  }

  public addCategory(newCategory: Partial<Category>) {
    return this.http.post<Category>(this.URL, newCategory).pipe(
      tap((addedCategory) => {
        this.categoriesSignal.update((cats) => [...(cats ?? []), addedCategory]);
      }),
      takeUntilDestroyed(this.destroyRef),
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
      takeUntilDestroyed(this.destroyRef),
    );
  }

  public resetCategories() {
    this.categoriesSignal.set(null);
  }

  public getCategoryByType(categoryType: CategoryEnum) {
    return this.http
      .get<Category[]>(`${this.URL}/${categoryType}`)
      .pipe(takeUntilDestroyed(this.destroyRef));
  }
}
