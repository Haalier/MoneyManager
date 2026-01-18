import { Component, inject, input, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Category } from '../../../models/category.model';
import { FormInput } from '../../../shared/form-input/form-input';
import { FormSelect } from '../../../shared/form-select/form-select';
import { CurrencyPipe } from '@angular/common';
import { Button } from 'primeng/button';
import { LoadingService } from '../../../shared/services/loading-service';

@Component({
  selector: 'app-income-form',
  imports: [
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
    FormInput,
    FormSelect,
    CurrencyPipe,
    Button,
  ],
  templateUrl: './income-form.html',
  styleUrl: './income-form.css',
})
export class IncomeForm implements OnInit {
  categories = input.required<Category[]>();
  private fb = inject(FormBuilder);
  private loadingService = inject(LoadingService);

  protected isLoading = this.loadingService.isLoading;

  protected incomeForm = this.fb.group({
    name: this.fb.control('', { validators: [Validators.required], nonNullable: true }),
    categoryId: this.fb.control(0, {
      validators: [Validators.required, Validators.min(0)],
      nonNullable: true,
    }),
    amount: this.fb.control(0, {
      validators: [Validators.required, Validators.min(0)],
      nonNullable: true,
    }),
    date: this.fb.control(new Date().toISOString().split('T')[0], { nonNullable: true }),
  });

  ngOnInit(): void {
    const cats = this.categories();
    if (cats?.length > 0 && !this.incomeForm.controls.categoryId.value) {
      this.incomeForm.patchValue({ categoryId: cats[0].id });
    }
  }
}
