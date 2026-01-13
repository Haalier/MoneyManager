import {Component} from '@angular/core';
import {NgIcon, provideIcons} from "@ng-icons/core";
import {lucidePlus} from '@ng-icons/lucide';
import {CategoryList} from './category-list/category-list';

@Component({
  selector: 'app-category',
  imports: [NgIcon, CategoryList],
  templateUrl: './category.html',
  styleUrl: './category.css',
  viewProviders: [provideIcons({lucidePlus})]
})
export class Category {

}
