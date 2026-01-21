import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { CategoryList } from './category-list/category-list';
import { Modal } from '../../shared/modal/modal';
import { CategoryForm } from './category-form/category-form';
import { Category as CategoryModel } from '../../shared/models/category.model';
import { CategoryService } from './category-service';
import { CategoryDTO } from '../../shared/models/DTO/category.dto'
import { HotToastService } from '@ngxpert/hot-toast';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-category',
  imports: [NgIcon, CategoryList, Modal, CategoryForm, TranslatePipe],
  templateUrl: './category.html',
  styleUrl: './category.css',
  viewProviders: [provideIcons({ lucidePlus })],
})
export class Category {
  @ViewChild('categoryForm') categoryFormRef!: CategoryForm;
  protected dialogVisible = signal<boolean>(false);
  protected categoryData = signal<CategoryModel | null>(null);
  protected categoryService = inject(CategoryService);
  protected categories = this.categoryService.getAllCategories();
  private toast = inject(HotToastService);
  protected isEditMode = computed(() => !!this.categoryData());

  protected openEditModal(category: CategoryModel) {
    this.categoryData.set(category);
    this.dialogVisible.set(true);
  }

  protected openAddModal() {
    this.categoryData.set(null);
    this.dialogVisible.set(true);
  }

  onFormSubmitted(newCategory: CategoryDTO) {
    const request$ =
      this.isEditMode() && this.categoryData()?.id
        ? this.categoryService.updateCategory(this.categoryData()!.id, newCategory)
        : this.categoryService.addCategory(newCategory);

    request$.subscribe({
      next: () => {
        const msg = this.isEditMode()
          ? 'Category successfully updated!'
          : 'Category successfully added!';
        this.dialogVisible.set(false);
        this.toast.success(msg);
        this.categoryFormRef.resetForm();
      },
    });
  }
}
