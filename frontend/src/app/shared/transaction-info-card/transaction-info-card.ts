import { Component, computed, inject, input, Input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideUtensilsCrossed,
  lucideTrash2,
  lucideTrendingUp,
  lucideTrendingDown,
} from '@ng-icons/lucide';
import { Income } from '../../models/income.model';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { Tooltip } from 'primeng/tooltip';
import { CategoryEnum } from '../../features/category/CategoryEnum';
import { EmojiComponent } from "@ctrl/ngx-emoji-mart/ngx-emoji";

@Component({
  selector: 'app-transaction-info-card',
  imports: [NgIcon, DatePipe, CurrencyPipe, Tooltip, EmojiComponent],
  templateUrl: './transaction-info-card.html',
  styleUrl: './transaction-info-card.css',
  viewProviders: [
    provideIcons({ lucideUtensilsCrossed, lucideTrash2, lucideTrendingUp, lucideTrendingDown }),
  ],
})
export class TransactionInfoCard {
  protected readonly CategoryEnum = CategoryEnum;
  @Input({ required: true })
  income!: Income;

  @Input()
  hideDeleteButton: boolean = false;

  type = input.required<'income' | 'expense'>();
  delete = output<number>();

  protected getComputedStyles = computed(() => {
    return this.type() === 'income'
      ? 'bg-green-50 border border-green-200 text-green-700'
      : 'bg-red-50 border border-red-200 text-red-700';
  });
  protected iconStyles = computed(() => {
    return this.type() === 'income'
      ? 'bg-green-50 text-green-600 border-green-100'
      : 'bg-red-50 text-red-600 border-red-100';
  });

  protected isTruncated(el: HTMLElement): boolean {
    return el.scrollWidth > el.clientWidth;
  }
  onDelete() {
    this.delete.emit(this.income.id);
  }
}
