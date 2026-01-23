import { Component, input } from '@angular/core';
import { FilterData } from '../../../shared/models/filterData.model';
import { TranslatePipe } from '@ngx-translate/core';
import { TransactionInfoCard } from '../../transaction/transaction-info-card/transaction-info-card';
import { TransactionType } from '../../../shared/enums/transactions.enum';

@Component({
  selector: 'app-filter-list',
  imports: [TranslatePipe, TransactionInfoCard],
  templateUrl: './filter-list.html',
  styleUrl: './filter-list.css',
})
export class FilterList {
  public transactions = input.required<FilterData | null>();
  public type = input.required<TransactionType>();
}
