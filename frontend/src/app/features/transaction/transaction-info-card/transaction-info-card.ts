import { Component, computed, input, output, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideUtensilsCrossed,
  lucideTrash2,
  lucideTrendingUp,
  lucideTrendingDown,
} from '@ng-icons/lucide';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { Tooltip } from 'primeng/tooltip';
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { Modal } from '../../../shared/modal/modal';
import { Income } from '../../../shared/models/income.model';
import { TranslatePipe } from '@ngx-translate/core';
import { TransactionType } from '../../../shared/enums/transactions.enum';
import { Expense } from '../../../shared/models/expense.model';

@Component({
  selector: 'app-transaction-info-card',
  imports: [NgIcon, DatePipe, CurrencyPipe, Tooltip, EmojiComponent, Modal, TranslatePipe],
  templateUrl: './transaction-info-card.html',
  styleUrl: './transaction-info-card.css',
  viewProviders: [
    provideIcons({ lucideUtensilsCrossed, lucideTrash2, lucideTrendingUp, lucideTrendingDown }),
  ],
})
export class TransactionInfoCard {
  protected readonly TransactionType = TransactionType;
  public type = input.required<TransactionType>();
  public transaction = input.required<Income | Expense>();
  public hideDeleteButton = input<boolean>(false);
  public delete = output<{ id: number; type: TransactionType }>();
  deleteModalVisible = signal<boolean>(false);

  protected getComputedStyles = computed(() => {
    return this.type() === 'income'
      ? 'bg-green-50 border border-green-200 text-green-700'
      : 'bg-red-50 border border-red-200 text-red-700';
  });
  protected iconStyles = computed(() => {
    return this.type() === TransactionType.INCOME
      ? 'bg-green-50 text-green-600 border-green-100'
      : 'bg-red-50 text-red-600 border-red-100';
  });

  protected isTruncated(el: HTMLElement): boolean {
    return el.scrollWidth > el.clientWidth;
  }

  onDeleteModalVisible(): void {
    this.deleteModalVisible.set(true);
  }

  onDelete() {
    this.delete.emit({ id: this.transaction().id, type: this.type() });
    this.deleteModalVisible.set(false);
  }
}
