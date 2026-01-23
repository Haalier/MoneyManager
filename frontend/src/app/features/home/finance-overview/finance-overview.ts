import { Component, inject, input } from '@angular/core';
import { Card } from 'primeng/card';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FinancialPieChartComponent } from './financial-pie-chart/financial-pie-chart';

@Component({
  selector: 'app-finance-overview',
  imports: [Card, TranslatePipe, FinancialPieChartComponent],
  templateUrl: './finance-overview.html',
  styleUrl: './finance-overview.css',
})
export class FinanceOverview {
  private translate = inject(TranslateService);
  totalBalance = input.required<number>();
  totalIncome = input.required<number>();
  totalExpense = input.required<number>();

  protected balanceData = [
    { name: this.translate.instant('dashboard.total_balance'), amount: this.totalBalance },
    { name: this.translate.instant('dashboard.total_income'), amount: this.totalIncome },
    { name: this.translate.instant('dashboard.total_expense'), amount: this.totalExpense },
  ];
}
