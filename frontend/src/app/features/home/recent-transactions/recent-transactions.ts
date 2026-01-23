import { Component, computed, input, output } from '@angular/core';
import { Card } from 'primeng/card';
import { TranslatePipe } from '@ngx-translate/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideInbox } from '@ng-icons/lucide';
import { TransactionInfoCard } from '../../transaction/transaction-info-card/transaction-info-card';
import { Transaction } from '../../../shared/models/transaction.model';
import { Button } from 'primeng/button';
import { Income } from '../../../shared/models/income.model';
import { Expense } from '../../../shared/models/expense.model';
import { TransactionType } from '../../../shared/enums/transactions.enum';

@Component({
  selector: 'app-recent-transactions',
  imports: [Card, TranslatePipe, NgIcon, TransactionInfoCard, Button],
  templateUrl: './recent-transactions.html',
  styleUrl: './recent-transactions.css',
  viewProviders: [provideIcons({ lucideArrowRight, lucideInbox })],
})
export class RecentTransactions {
  protected readonly TransactionType = TransactionType;
  showMore = output<TransactionType>();
  transactions = input.required<Transaction[] | Expense[] | Income[] | null>();
  label = input.required<string>();
  type = input<TransactionType>();
  hideButton = input<boolean>(false);

  protected displayTransactions = computed(() => {
    const rawData = this.transactions();
    const defaultType = this.type() ?? TransactionType.INCOME;
    if (!rawData) {
      return [];
    }

    return rawData.map((item) => ({
      ...item,
      displayType: 'type' in item && item.type ? item.type : defaultType,
    }));
  });

  onMore(): void {
    console.log(this.displayTransactions());

    this.showMore.emit(this.type() ?? TransactionType.INCOME);
  }
}
