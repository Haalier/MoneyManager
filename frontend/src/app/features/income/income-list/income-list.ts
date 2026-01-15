import { Component } from '@angular/core';
import { Card } from 'primeng/card';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMail, lucideDownload } from '@ng-icons/lucide';

@Component({
  selector: 'app-income-list',
  imports: [Card, NgIcon],
  templateUrl: './income-list.html',
  styleUrl: './income-list.css',
  viewProviders: [provideIcons({ lucideMail, lucideDownload })],
})
export class IncomeList {}
