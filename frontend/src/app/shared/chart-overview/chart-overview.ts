import { Component, effect, inject, input, signal } from '@angular/core';
import { LoadingService } from '../../core/services/loading-service';
import { TranslateService } from '@ngx-translate/core';
import { Income } from '../models/income.model';
import { Expense } from '../models/expense.model';
import { prepareChartData } from '../utils/prepare-chart';
import { TranslatePipe } from '@ngx-translate/core';
import { TransactionType } from '../enums/transactions.enum';
import { SpinnerComponent } from '../spinner/spinner';
import { Card } from 'primeng/card';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-chart-overview',
  imports: [TranslatePipe, SpinnerComponent, Card, ChartModule],
  templateUrl: './chart-overview.html',
  styleUrl: './chart-overview.css',
})
export class ChartOverview {
  public type = input.required<TransactionType>();
  public transactions = input.required<Income[] | Expense[] | null>();
  private translate = inject(TranslateService);
  private loadingService = inject(LoadingService);
  protected isLoading = this.loadingService.isLoading;

  chartData = signal<any>(null);
  chartOptions = signal<any>(null);

  constructor() {
    effect(() => {
      const currentTransactions = this.transactions();
      const currentLang = this.translate.getCurrentLang() || 'pl';
      const currentType = this.type();

      if (currentTransactions && currentTransactions.length > 0) {
        const prepared = prepareChartData(currentTransactions, currentLang);
        this.chartData.set(prepared);

        this.chartOptions.set({
          maintainAspectRatio: false,
          aspectRatio: 1,
          plugins: {
            tooltip: {
              callbacks: {
                title: (context: any) => {
                  const index = context[0].dataIndex;
                  const fullData = context[0].dataset.extraData[index];
                  const dateLabel = this.translate.instant('general.date');
                  return `${dateLabel}: ${fullData.date}`;
                },
                label: (context: any) => {
                  const index = context.dataIndex;
                  const group = context.dataset.extraData[index];
                  const itemsList = group.items
                    .map((i: any) => `- ${i.name}: ${i.amount}`)
                    .join('\n');
                  const totalLabel = this.translate.instant(`${currentType}.overview.total`);
                  const transactionsLabel = this.translate.instant(
                    `${currentType}.overview.transactions`,
                  );

                  return [
                    `${totalLabel}: ${group.totalAmount}`,
                    `${transactionsLabel}:`,
                    itemsList,
                  ];
                },
              },
            },
            legend: { display: false },
          },
          scales: {
            y: { beginAtZero: true },
          },
        });
      }
    });
  }
}
