import { Component, inject, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowRight,
  lucideCoins,
  lucideFunnelPlus,
  lucideLayoutDashboard,
  lucideList,
  lucideUser,
  lucideWallet,
} from '@ng-icons/lucide';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../features/auth/auth-service';

const SIDE_BAR_DATA: { label: string; icon: string; path: string }[] = [
  {
    label: 'sidebar-info.dashboard',
    icon: 'lucideLayoutDashboard',
    path: '/dashboard',
  },
  {
    label: 'sidebar-info.category',
    icon: 'lucideList',
    path: 'category',
  },
  {
    label: 'sidebar-info.income',
    icon: 'lucideWallet',
    path: 'income',
  },
  {
    label: 'sidebar-info.expense',
    icon: 'lucideCoins',
    path: 'expense',
  },
  {
    label: 'sidebar-info.filters',
    icon: 'lucideFunnelPlus',
    path: 'filter',
  },
];

@Component({
  selector: 'app-sidebar',
  imports: [NgIcon, RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  viewProviders: [
    provideIcons({
      lucideUser,
      lucideLayoutDashboard,
      lucideList,
      lucideWallet,
      lucideCoins,
      lucideFunnelPlus,
      lucideArrowRight,
    }),
  ],
})
export class Sidebar {
  protected readonly sidebarItems = SIDE_BAR_DATA;
  private readonly authService = inject(AuthService);
  protected readonly user = this.authService.user;
  closeSidebarEvent = output<void>();

  protected onCloseSidebar() {
    this.closeSidebarEvent.emit();
  }
}
