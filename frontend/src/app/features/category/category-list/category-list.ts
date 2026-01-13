import { Component, inject, OnInit, output } from '@angular/core';
import { CategoryService } from '../category-service';
import { CategoryEnum } from '../CategoryEnum';
import { SpinnerComponent } from '../../../shared/spinner/spinner';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLayers, lucidePencil } from '@ng-icons/lucide';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-category-list',
  imports: [SpinnerComponent, NgIcon, Card],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
  viewProviders: [provideIcons({ lucideLayers, lucidePencil })],
})
export class CategoryList implements OnInit {
  protected readonly CategoryEnum = CategoryEnum;
  protected readonly categoryService = inject(CategoryService);
  categories = this.categoryService.categories;
  loader = this.categoryService.isLoading;

  updateEvent = output<void>();

  ngOnInit() {
    this.categoryService.getCategories();
  }

  onUpdate() {
    this.updateEvent.emit();
  }
}
