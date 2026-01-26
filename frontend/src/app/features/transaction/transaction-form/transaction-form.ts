import { Component, effect, inject, input, output } from '@angular/core';
import { EmojiPicker } from '../../../shared/emoji-picker/emoji-picker';
import { FormInput } from '../../../shared/form-input/form-input';
import { FormSelect } from '../../../shared/form-select/form-select';
import { Button } from 'primeng/button';
import { IncomeDTO } from '../../../shared/models/DTO/income.dto';
import { ExpenseDTO } from '../../../shared/models/DTO/expense.dto';
import { TransactionType } from '../../../shared/enums/transactions.enum';
import {
  FormBuilder,
  Validators,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { LoadingService } from '../../../core/services/loading-service';
import { futureDateValidator } from '../../../core/validators/date.validator';
import { Category } from '../../../shared/models/category.model';
import { TranslatePipe } from '@ngx-translate/core';
import { CurrencyPipe } from '@angular/common';
import { validateNumber } from '../../../core/validators/number.validator';

@Component({
  selector: 'app-transaction-form',
  imports: [
    EmojiPicker,
    FormInput,
    FormSelect,
    Button,
    TranslatePipe,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
    CurrencyPipe,
  ],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.css',
})
export class TransactionForm {
  public type = input.required<TransactionType>();
  public categories = input.required<Category[]>();
  public save = output<IncomeDTO | ExpenseDTO>();
  private fb = inject(FormBuilder);
  private loadingService = inject(LoadingService);
  protected isLoading = this.loadingService.isLoading;

  protected transactionForm = this.fb.group({
    name: this.fb.control('', { validators: [Validators.required], nonNullable: true }),
    categoryId: this.fb.control(0, {
      validators: [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)],
      nonNullable: true,
    }),
    amount: this.fb.control(0, {
      validators: [validateNumber(), Validators.required, Validators.min(0)],
      nonNullable: true,
    }),
    icon: this.fb.control('dollar', { nonNullable: true }),
    date: this.fb.control(new Date().toISOString().split('T')[0], {
      validators: [futureDateValidator()],
      nonNullable: true,
    }),
  });

  constructor() {
    effect(() => {
      const cats = this.categories();
      if (cats?.length > 0 && !this.transactionForm.controls.categoryId.value) {
        this.transactionForm.patchValue({ categoryId: cats[0].id });
      }
    });
  }

  protected onSubmit() {
    if (this.transactionForm.invalid) return;
    const transactionData = this.transactionForm.getRawValue();
    this.save.emit(transactionData);
  }

  resetForm() {
    this.transactionForm.reset({ categoryId: this.categories()[0].id });
  }
}
