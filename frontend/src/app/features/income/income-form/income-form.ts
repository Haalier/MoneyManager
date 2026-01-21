import { Component, effect, inject, input, OnInit, output } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormInput } from '../../../shared/form-input/form-input';
import { FormSelect } from '../../../shared/form-select/form-select';
import { CurrencyPipe } from '@angular/common';
import { Button } from 'primeng/button';
import { LoadingService } from '../../../core/services/loading-service';
import { EmojiPicker } from '../../../shared/emoji-picker/emoji-picker';
import { futureDateValidator } from '../../../core/validators/date.validator';
import { TranslatePipe } from '@ngx-translate/core';
import { IncomeDTO } from '../../../shared/models/DTO/income.dto';
import { Category } from '../../../shared/models/category.model';

@Component({
  selector: 'app-income-form',
  imports: [
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
    FormInput,
    FormSelect,
    CurrencyPipe,
    Button,
    EmojiPicker,
    TranslatePipe,
  ],
  templateUrl: './income-form.html',
  styleUrl: './income-form.css',
})
export class IncomeForm {
  save = output<IncomeDTO>();
  categories = input.required<Category[]>();
  private fb = inject(FormBuilder);
  private loadingService = inject(LoadingService);

  protected isLoading = this.loadingService.isLoading;

  protected incomeForm = this.fb.group({
    name: this.fb.control('', { validators: [Validators.required], nonNullable: true }),
    categoryId: this.fb.control(0, {
      validators: [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)],
      nonNullable: true,
    }),
    amount: this.fb.control(0, {
      validators: [Validators.required, Validators.min(0)],
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
      if (cats?.length > 0 && !this.incomeForm.controls.categoryId.value) {
        this.incomeForm.patchValue({ categoryId: cats[0].id });
      }
    });
  }

  protected onSubmit() {
    if (this.incomeForm.invalid) return;
    const incomeData = this.incomeForm.getRawValue();
    this.save.emit(incomeData);
  }

  resetForm() {
    this.incomeForm.reset({ categoryId: this.categories()[0].id });
  }
}
