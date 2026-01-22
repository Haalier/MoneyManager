import { Component, inject, Signal, signal, ViewChild } from '@angular/core';
import { IncomeService } from './income-service';
import { Modal } from '../../shared/modal/modal';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { CategoryService } from '../category/category-service';
import { SpinnerComponent } from '../../shared/spinner/spinner';
import { LoadingService } from '../../core/services/loading-service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { IncomeDTO } from '../../shared/models/DTO/income.dto';
import { HotToastService } from '@ngxpert/hot-toast';
import { finalize, Observable } from 'rxjs';
import { ChartOverview } from '../../shared/chart-overview/chart-overview';
import { TransactionType } from '../../shared/enums/transactions.enum';
import { TransactionList } from '../transaction/transaction-list/transaction-list';
import { TransactionForm } from '../transaction/transaction-form/transaction-form';
import { BaseTransactionComponent } from '../transaction/base-transaction/base-transaction';
import { Category } from '../../shared/models/category.model';

@Component({
  selector: 'app-income',
  imports: [
    Modal,
    NgIcon,
    SpinnerComponent,
    TranslatePipe,
    ChartOverview,
    TransactionList,
    TransactionForm,
  ],
  templateUrl: './income.html',
  styleUrl: './income.css',
  viewProviders: [provideIcons({ lucidePlus })],
})
export class Income extends BaseTransactionComponent<IncomeDTO> {
  protected override TYPE = TransactionType.INCOME;
  protected override filename = 'income_details.xlsx';
  private incomeService = inject(IncomeService);
  protected override transactions = this.incomeService.getCurrentMonthIncomes();
  protected override categories = this.categoryService.getCategoryByType(this.TYPE);

  protected override addAction(data: IncomeDTO): Observable<any> {
    return this.incomeService.addIncome(data);
  }

  protected override deleteAction(id: number): Observable<any> {
    return this.incomeService.deleteIncome(id);
  }

  protected override downloadAction(): Observable<Blob> {
    return this.incomeService.downloadIncomeExcel();
  }

  protected override emailAction(): Observable<any> {
    return this.incomeService.sendEmailWithIncomeExcel();
  }
}
