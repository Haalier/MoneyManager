import { Component, inject, OnInit, output } from '@angular/core';
import { CategoryService } from '../category-service';
import { CategoryEnum } from '../CategoryEnum';
import { SpinnerComponent } from '../../../shared/spinner/spinner';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLayers, lucidePencil } from '@ng-icons/lucide';
import { Card } from 'primeng/card';
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { Category } from '../../../models/category.model';
import { LoadingService } from '../../../shared/services/loading-service';

@Component({
  selector: 'app-category-list',
  imports: [SpinnerComponent, NgIcon, Card, EmojiComponent],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
  viewProviders: [provideIcons({ lucideLayers, lucidePencil })],
})
export class CategoryList implements OnInit {
  protected readonly CategoryEnum = CategoryEnum;
  protected readonly categoryService = inject(CategoryService);
  private readonly loadingService = inject(LoadingService);
  categories = this.categoryService.categories;
  loader = this.loadingService.isLoading;

  updateEvent = output<Category>();

  ngOnInit() {
    this.categoryService.getCategories();
  }

  onUpdate(category: Category) {
    this.updateEvent.emit(category);
  }
}
