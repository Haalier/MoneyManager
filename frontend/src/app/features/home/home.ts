import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { InfoCard } from './info-card/info-card';
import { TranslatePipe } from '@ngx-translate/core';
import { DashboardService } from './dashboard-service';
import { DashboardData } from '../../shared/models/dashboardData.model';
import { RecentTransactions } from './recent-transactions/recent-transactions';
import { FinanceOverview } from './finance-overview/finance-overview';
import { TransactionType } from '../../shared/enums/transactions.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [InfoCard, TranslatePipe, RecentTransactions, FinanceOverview],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  protected readonly TransactionType = TransactionType;
  private dashboardService = inject(DashboardService);
  protected dashboardData: Signal<DashboardData | null> = signal(null);
  private router = inject(Router);

  ngOnInit(): void {
    this.dashboardData = this.dashboardService.getDashboardData();
  }

  onShowMore(event: TransactionType) {
    this.router.navigate([`/${event}`]);
  }
}
