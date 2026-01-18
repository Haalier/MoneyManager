import { Component, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { CategoryList } from './category-list/category-list';
import { Modal } from '../../shared/modal/modal';
import { CategoryForm } from './category-form/category-form';
import { Category as CategoryModel } from '../../models/category.model';
import { CategoryService } from './category-service';

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

  protected onUpdateEvent(category: CategoryModel) {
    this.categoryData.set(category);
    this.editDialogVisible = true;
  }

  protected onCreateCategory() {
    this.addDialogVisible = true;
  }
}
