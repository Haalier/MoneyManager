import { Component, inject, input, Input, OnInit, output } from '@angular/core';
import { Card } from 'primeng/card';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMail, lucideDownload } from '@ng-icons/lucide';
import { SpinnerComponent } from '../../../shared/spinner/spinner';
import { LoadingService } from '../../../shared/services/loading-service';
import { Income } from '../../../models/income.model';
import { TransactionInfoCard } from '../../../shared/transaction-info-card/transaction-info-card';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-income-list',
  imports: [Card, NgIcon, SpinnerComponent, TransactionInfoCard, TranslatePipe],
  templateUrl: './income-list.html',
  styleUrl: './income-list.css',
  viewProviders: [provideIcons({ lucideMail, lucideDownload })],
})
export class IncomeList {
  transactions = input<Income[] | null>();
  delete = output<number>();

  private readonly loadingService = inject(LoadingService);
  protected readonly loader = this.loadingService.isLoading;

  protected onDelete(event: number) {
    this.delete.emit(event);
  }
}
