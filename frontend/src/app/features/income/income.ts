import { Component, inject, OnInit } from '@angular/core';
import { IncomeService } from './income-service';

@Component({
  selector: 'app-income',
  imports: [],
  templateUrl: './income.html',
  styleUrl: './income.css',
})
export class Income implements OnInit {
  private incomeService = inject(IncomeService);

  ngOnInit() {}
}
