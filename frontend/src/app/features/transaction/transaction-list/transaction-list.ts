import { Component, inject, input, output } from '@angular/core';
import { SpinnerComponent } from '../../../shared/spinner/spinner';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { Tooltip } from 'primeng/tooltip';
import { TransactionInfoCard } from '../transaction-info-card/transaction-info-card';
import { TranslatePipe } from '@ngx-translate/core';
import { TransactionType } from '../../../shared/enums/transactions.enum';
import { Income } from '../../../shared/models/income.model';
import { Expense } from '../../../shared/models/expense.model';
import { LoadingService } from '../../../core/services/loading-service';
import { lucideDownload, lucideMail } from '@ng-icons/lucide';

@Component({
  selector: 'app-transaction-list',
  imports: [SpinnerComponent, Card, Button, NgIcon, Tooltip, TransactionInfoCard, TranslatePipe],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.css',
  viewProviders: [provideIcons({ lucideDownload, lucideMail })],
})
export class TransactionList {
  public type = input.required<TransactionType>();
  public transactions = input.required<Income[] | Expense[] | null>();
  public downloadLoader = input.required<boolean>();
  public emailLoader = input.required<boolean>();
  public delete = output<number>();
  public downloadExcel = output<void>();
  public sendEmailWithTransaction = output<void>();

  private readonly loadingService = inject(LoadingService);
  protected readonly isLoading = this.loadingService.isLoading;

  protected onDelete(event: { id: number; type: TransactionType }) {
    this.delete.emit(event.id);
  }

  protected onTransactionDownload() {
    this.downloadExcel.emit();
  }

  protected onTransactionEmail() {
    this.sendEmailWithTransaction.emit();
  }
}
