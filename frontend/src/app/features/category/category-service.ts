import { DestroyRef, inject, Injectable, signal, WritableSignal } from '@angular/core';
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
  private destroyRef = inject(DestroyRef);

  private allCategoriesSignal = signal<Category[] | null>(null);

  private categoriesByTypeCache = new Map<CategoryEnum, WritableSignal<Category[]>>();

  public getAllCategories() {
    if (this.allCategoriesSignal() === null) {
      this.allCategoriesSignal.set([]);
      this.http
        .get<Category[]>(this.URL)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((cats) => {
          this.allCategoriesSignal.set(cats);
        });
    }

    return this.allCategoriesSignal.asReadonly();
  }

  public addCategory(newCategory: Partial<Category>) {
    return this.http.post<Category>(this.URL, newCategory).pipe(
      tap((addedCategory) => {
        const type = addedCategory.type as CategoryEnum;
        if (this.categoriesByTypeCache.has(type)) {
          this.categoriesByTypeCache.get(type)?.update((cats) => [...cats, addedCategory]);
        }
        if (this.allCategoriesSignal() !== null) {
          this.allCategoriesSignal.update((cats) => [...(cats ?? []), addedCategory]);
        }
      }),
      takeUntilDestroyed(this.destroyRef),
    );
  }

  public updateCategory(categoryId: number, category: Partial<Category>) {
    return this.http.put<Category>(`${this.URL}/${categoryId}`, category).pipe(
      tap((updatedCategory) => {
        this.allCategoriesSignal.update((cats) => {
          if (!cats) return [];

          return cats?.map((cat) => (cat.id === categoryId ? updatedCategory : cat));
        });
      }),
      takeUntilDestroyed(this.destroyRef),
    );
  }

  public resetCategories() {
    this.allCategoriesSignal.set(null);
  }

  public getCategoryByType(type: CategoryEnum) {
    if (!this.categoriesByTypeCache.has(type)) {
      this.categoriesByTypeCache.set(type, signal<Category[]>([]));
      this.refreshCategoriesByType(type);
    }

    return this.categoriesByTypeCache.get(type)!.asReadonly();
  }

  private refreshCategoriesByType(type: CategoryEnum): void {
    this.http
      .get<Category[]>(`${this.URL}/${type}`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.categoriesByTypeCache.get(type)?.set(data);
      });
  }
}
