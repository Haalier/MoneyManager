import { Component, inject } from '@angular/core';
import { AuthService } from '../../features/auth/auth-service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLayoutDashboard, lucideList, lucideUser } from '@ng-icons/lucide';

@Component({
  selector: 'app-sidebar',
  imports: [NgIcon],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  viewProviders: [provideIcons({ lucideUser, lucideLayoutDashboard, lucideList })]
})
export class Sidebar {
  private authService = inject(AuthService);
  protected user = this.authService.user;

  protected SIDE_BAR_DATA: { label: string, icon: string, path: string }[] = [
    {
      label: 'Dashboard',
      icon: 'lucideLayoutDashboard',
      path: '/dashboard'
    },
    {
      label: 'Category',
      icon: 'lucideList',
      path: '/category'
    },
  ]
}
