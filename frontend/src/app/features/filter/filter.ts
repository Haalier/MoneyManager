import { Component, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Card } from 'primeng/card';
import { FormSelect } from '../../shared/form-select/form-select';
import {
  FormBuilder,
  Validators,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormInput } from '../../shared/form-input/form-input';
import { LoadingService } from '../../core/services/loading-service';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';
import { FilterService } from './filter-service';
import { FilterDTO } from '../../shared/models/DTO/filter.dto';
import { FilterList } from './filter-list/filter-list';
import { SpinnerComponent } from '../../shared/spinner/spinner';
import { TransactionType } from '../../shared/enums/transactions.enum';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-filter',
  imports: [
    TranslatePipe,
    Card,
    FormSelect,
    ɵInternalFormsSharedModule,
    FormInput,
    ReactiveFormsModule,
    NgIcon,
    FilterList,
    SpinnerComponent,
    DatePickerModule,
  ],
  templateUrl: './filter.html',
  styleUrl: './filter.css',
  viewProviders: [provideIcons({ lucideSearch })],
})
export class Filter {
  private filterService = inject(FilterService);
  private loadingService = inject(LoadingService);
  private fb = inject(FormBuilder);
  protected date = new Date();
  protected isLoading = this.loadingService.isLoading;
  protected transactions = this.filterService.transactions;
  protected currentType = signal<TransactionType>(TransactionType.INCOME);

  protected typeOptions = [
    {
      value: 'income',
      label: 'general.income',
    },
    {
      value: 'expense',
      label: 'general.expense',
    },
  ];
  protected orderOptions = [
    {
      value: 'asc',
      label: 'filters.order.ascending',
    },
    {
      value: 'desc',
      label: 'filters.order.descending',
    },
  ];
  protected sortOptions = [
    {
      value: 'date',
      label: 'filters.sort.date',
    },
    {
      value: 'amount',
      label: 'filters.sort.amount',
    },
    {
      value: 'category',
      label: 'filters.sort.category',
    },
  ];

  protected filterForm = this.fb.group({
    type: this.fb.control('income', { validators: [Validators.required], nonNullable: true }),
    // startDate: this.fb.control(format(startOfMonth(new Date()), 'yyyy-MM-dd'), {
    //   validators: [Validators.required],
    //   nonNullable: true,
    // }),
    // endDate: this.fb.control(format(endOfMonth(new Date()), 'yyyy-MM-dd'), {
    //   validators: [Validators.required],
    //   nonNullable: true,
    // }),
    dates: this.fb.control([startOfMonth(new Date()), new Date()], {
      validators: [Validators.required],
      nonNullable: true,
    }),
    sortOrder: this.fb.control('asc', { validators: [Validators.required], nonNullable: true }),
    sortField: this.fb.control('date', { validators: [Validators.required], nonNullable: true }),
    keyword: this.fb.control(''),
  });

  onSearch() {
    const dates = this.filterForm.value.dates;
    if (!dates || dates.length < 1) {
      this.filterForm.setErrors({ invalidDates: true });
      return;
    }

    if (dates[1] === null) {
      dates[1] = dates[0];
    }
    const filterObj = {
      ...this.filterForm.getRawValue(),
      startDate: format(dates[0], 'yyyy-MM-dd'),
      endDate: format(dates[1], 'yyyy-MM-dd'),
    } as FilterDTO;

    this.filterService.addFilters(filterObj).subscribe(() => {
      this.currentType.set(filterObj.type);
    });
  }

  get maxDate(): Date {
    return new Date();
  }
}
