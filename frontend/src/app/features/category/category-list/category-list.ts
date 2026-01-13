import {Component, inject, OnInit} from '@angular/core';
import {CategoryService} from '../category-service';
import {CategoryEnum} from '../CategoryEnum';
import {SpinnerComponent} from '../../../shared/spinner/spinner';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {lucideLayers} from '@ng-icons/lucide';
import {Card} from 'primeng/card';

@Component({
  selector: 'app-category-list',
  imports: [
    SpinnerComponent,
    NgIcon,
    Card
  ],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
  viewProviders: [provideIcons({lucideLayers})]
})
export class CategoryList implements OnInit {
  protected readonly CategoryEnum = CategoryEnum;
  protected readonly categoryService = inject(CategoryService);
  categories = this.categoryService.categories;
  loader = this.categoryService.isLoading;

  ngOnInit() {
    this.categoryService.getCategories();
  }
}
