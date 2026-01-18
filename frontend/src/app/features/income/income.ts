import { Component, inject, signal } from '@angular/core';
import { IncomeService } from './income-service';
import { IncomeList } from './income-list/income-list';
import { Modal } from '../../shared/modal/modal';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { toSignal } from '@angular/core/rxjs-interop';
import { CategoryService } from '../category/category-service';
import { CategoryEnum } from '../category/CategoryEnum';
import { IncomeForm } from './income-form/income-form';
import { SpinnerComponent } from '../../shared/spinner/spinner';
import { LoadingService } from '../../shared/services/loading-service';
import { IncomeDTO } from '../../models/DTO/income.dto';

@Component({
  selector: 'app-income',
  imports: [IncomeList, Modal, NgIcon, IncomeForm, SpinnerComponent],
  templateUrl: './income.html',
  styleUrl: './income.css',
  viewProviders: [provideIcons({ lucidePlus })],
})
export class Income {
  private TYPE = CategoryEnum.INCOME;
  protected incomeService = inject(IncomeService);
  private categoryService = inject(CategoryService);
  private loadingService = inject(LoadingService);
  isLoading = this.loadingService;
  addDialogVisible = signal<boolean>(false);
  protected incomeCategories = this.categoryService.getCategoryByType(this.TYPE);
  protected transactions = this.incomeService.getCurrentMonthIncomes();

  protected onDialogToggle(): void {
    this.addDialogVisible.set(true);
  }

  onSubmitForm(event: IncomeDTO) {
    this.incomeService.addIncome(event).subscribe({
      next: () => this.addDialogVisible.set(false),
    });
  }
}
