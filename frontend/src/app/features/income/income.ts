import { Component, inject, OnInit } from '@angular/core';
import { IncomeService } from './income-service';
import { IncomeList } from './income-list/income-list';

@Component({
  selector: 'app-income',
  imports: [IncomeList],
  templateUrl: './income.html',
  styleUrl: './income.css',
})
export class Income implements OnInit {
  private incomeService = inject(IncomeService);
  incomes = this.incomeService.incomes;
  isLoading = this.incomeService.isLoading;

  totals = this.incomeService.totalIncomes;

  ngOnInit() {
    this.incomeService.getCurrentMonthIncomes();
  }
}
