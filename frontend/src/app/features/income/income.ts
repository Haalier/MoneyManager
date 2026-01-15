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
  protected incomeService = inject(IncomeService);
  isLoading = this.incomeService.isLoading;

  ngOnInit() {
    this.incomeService.getCurrentMonthIncomes();
  }
}
