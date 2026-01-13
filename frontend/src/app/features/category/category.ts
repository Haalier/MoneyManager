import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { CategoryList } from './category-list/category-list';
import { Dialog } from 'primeng/dialog';
import { Modal } from '../../shared/modal/modal';
import { CategoryForm } from './category-form/category-form';

@Component({
  selector: 'app-category',
  imports: [NgIcon, CategoryList, Dialog, Modal, CategoryForm],
  templateUrl: './category.html',
  styleUrl: './category.css',
  viewProviders: [provideIcons({ lucidePlus })],
})
export class Category {
  protected editDialogVisible = false;
  protected addDialogVisible = false;

  protected onUpdateEvent() {
    this.editDialogVisible = true;
  }

  protected onCreateCategory() {
    this.addDialogVisible = true;
  }
}
