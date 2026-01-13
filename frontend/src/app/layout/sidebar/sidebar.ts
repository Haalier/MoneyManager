import { Component, inject } from '@angular/core';
import { AuthService } from '../../features/auth/auth-service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideCoins, lucideFunnelPlus, lucideLayoutDashboard, lucideList, lucideUser, lucideWallet } from '@ng-icons/lucide';
import { RouterLink, RouterLinkActive } from "@angular/router";

const SIDE_BAR_DATA: { label: string, icon: string, path: string }[] = [
  {
    label: 'Dashboard',
    icon: 'lucideLayoutDashboard',
    path: '/dashboard'
  },
  {
    label: 'Category',
    icon: 'lucideList',
    path: 'category'
  },
  {
    label: 'Income',
    icon: 'lucideWallet',
    path: 'income'
  },
  {
    label: 'Expense',
    icon: 'lucideCoins',
    path: 'expense',
  },
  {
    label: 'Filters',
    icon: 'lucideFunnelPlus',
    path: 'filter'
  }

]

@Component({
  selector: 'app-sidebar',
  imports: [NgIcon, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  viewProviders: [provideIcons({ lucideUser, lucideLayoutDashboard, lucideList, lucideWallet, lucideCoins, lucideFunnelPlus, lucideArrowRight })]
})
export class Sidebar {
  protected readonly sidebarItems = SIDE_BAR_DATA;
  private readonly authService = inject(AuthService);
  protected readonly user = this.authService.user;
}
