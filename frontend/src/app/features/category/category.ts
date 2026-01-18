import { Component, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { CategoryList } from './category-list/category-list';
import { Modal } from '../../shared/modal/modal';
import { CategoryForm } from './category-form/category-form';
import { Category as CategoryModel } from '../../models/category.model';
import { CategoryService } from './category-service';
import { CategoryDTO } from '../../models/DTO/category.dto';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-category',
  imports: [NgIcon, CategoryList, Modal, CategoryForm],
  templateUrl: './category.html',
  styleUrl: './category.css',
  viewProviders: [provideIcons({ lucidePlus })],
})
export class Category {
  protected editDialogVisible = false;
  protected addDialogVisible = false;
  protected categoryData = signal<CategoryModel | null>(null);
  protected categoryService = inject(CategoryService);
  protected categories = this.categoryService.getAllCategories();
  private toast = inject(HotToastService);

  protected onUpdateEvent(category: CategoryModel) {
    this.categoryData.set(category);
    this.editDialogVisible = true;
  }

  protected onCreateCategory() {
    this.addDialogVisible = true;
  }

  onFormSubmitted(event: { isEditMode: boolean; newCategory: CategoryDTO }) {
    const { isEditMode, newCategory } = event;

    const request$ =
      isEditMode && this.categoryData()?.id
        ? this.categoryService.updateCategory(this.categoryData()!.id, newCategory)
        : this.categoryService.addCategory(newCategory);

    request$.subscribe({
      next: () => {
        const msg = isEditMode ? 'Category successfully updated!' : 'Category successfully added!';
        isEditMode ? (this.editDialogVisible = false) : (this.addDialogVisible = false);
        this.toast.success(msg);
      },
      error: (err) => {
        const msg = isEditMode ? 'Failed to update category' : 'Failed to update category';
        this.toast.error(err.response?.data?.message || msg);
      },
    });
  }
}
