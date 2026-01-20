import { Component, inject, input, output } from '@angular/core';
import { CategoryService } from '../category-service';
import { CategoryEnum } from '../CategoryEnum';
import { SpinnerComponent } from '../../../shared/spinner/spinner';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLayers, lucidePencil } from '@ng-icons/lucide';
import { Card } from 'primeng/card';
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { Category } from '../../../models/category.model';
import { LoadingService } from '../../../shared/services/loading-service';
import { Tooltip } from 'primeng/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-category-list',
  imports: [SpinnerComponent, NgIcon, Card, EmojiComponent, Tooltip, TranslatePipe],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
  viewProviders: [provideIcons({ lucideLayers, lucidePencil })],
})
export class CategoryList {
  categories = input<Category[] | null>(null);
  protected readonly CategoryEnum = CategoryEnum;
  private readonly loadingService = inject(LoadingService);
  loader = this.loadingService.isLoading;

  updateEvent = output<Category>();

  onUpdate(category: Category) {
    this.updateEvent.emit(category);
  }
}
