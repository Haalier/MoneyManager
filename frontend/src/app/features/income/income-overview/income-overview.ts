import { Component, effect, inject, input, signal } from '@angular/core';
import { Card } from 'primeng/card';
import { Income } from '../../../models/income.model';
import { ChartModule } from 'primeng/chart';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { prepareChartData } from '../../../utils/prepare-chart';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoadingService } from '../../../shared/services/loading-service';
import { SpinnerComponent } from '../../../shared/spinner/spinner';

@Component({
  selector: 'app-income-overview',
  imports: [Card, ChartModule, TranslatePipe, SpinnerComponent],
  templateUrl: './income-overview.html',
  styleUrl: './income-overview.css',
})
export class IncomeOverview {
  transactions = input.required<Income[] | null>();
  private translate = inject(TranslateService);
  private loadingService = inject(LoadingService);
  protected isLoading = this.loadingService.isLoading;

  chartData = signal<any>(null);
  chartOptions = signal<any>(null);

  constructor() {
    effect(() => {
      console.log(this.transactions());

      const currentTransactions = this.transactions();
      const currentLang = this.translate.getCurrentLang() || 'pl';

      if (currentTransactions && currentTransactions.length > 0) {
        const prepared = prepareChartData(currentTransactions, currentLang);
        this.chartData.set(prepared);

        this.chartOptions.set({
          maintainAspectRatio: false,
          aspectRatio: 0.6,
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
                  const totalLabel = this.translate.instant('incomes.overview.total');
                  const transactionsLabel = this.translate.instant('incomes.overview.transactions');

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

    this.translate.onLangChange.pipe(takeUntilDestroyed()).subscribe((event) => {
      const currentTransactions = this.transactions();
      if (currentTransactions) {
        this.chartData.set(prepareChartData(currentTransactions, event.lang));
      }
    });
  }
}
