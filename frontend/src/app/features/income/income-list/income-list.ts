import { Component, inject, input, Input, OnInit } from '@angular/core';
import { Card } from 'primeng/card';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMail, lucideDownload } from '@ng-icons/lucide';
import { SpinnerComponent } from '../../../shared/spinner/spinner';
import { LoadingService } from '../../../shared/services/loading-service';
import { Income } from '../../../models/income.model';
import { TransactionInfoCard } from '../../../shared/transaction-info-card/transaction-info-card';

@Component({
  selector: 'app-income-list',
  imports: [Card, NgIcon, SpinnerComponent, TransactionInfoCard],
  templateUrl: './income-list.html',
  styleUrl: './income-list.css',
  viewProviders: [provideIcons({ lucideMail, lucideDownload })],
})
export class IncomeList {
  transactions = input<Income[] | null>();

  private readonly loadingService = inject(LoadingService);
  protected readonly loader = this.loadingService.isLoading;
}
