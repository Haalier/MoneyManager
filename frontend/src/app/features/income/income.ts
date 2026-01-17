import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
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

@Component({
  selector: 'app-income',
  imports: [IncomeList, Modal, NgIcon, IncomeForm, SpinnerComponent],
  templateUrl: './income.html',
  styleUrl: './income.css',
  viewProviders: [provideIcons({ lucidePlus })],
})
export class Income implements OnInit {
  private TYPE = CategoryEnum.INCOME;
  protected incomeService = inject(IncomeService);
  private categoryService = inject(CategoryService);
  isLoading = this.incomeService.isLoading;
  addDialogVisible = signal<boolean>(false);
  protected incomeCategories = toSignal(this.categoryService.getCategoryByType(this.TYPE), {
    initialValue: [],
  });

  ngOnInit() {
    this.incomeService.getCurrentMonthIncomes();
  }

  protected onDialogToggle(): void {
    this.addDialogVisible.set(true);
  }
}
