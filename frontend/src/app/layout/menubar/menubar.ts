import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { AuthService } from '../../features/auth/auth-service';
import { lucideLogOut, lucideMenu, lucideUser, lucideX } from '@ng-icons/lucide';
import { PopoverModule } from 'primeng/popover';
import { Sidebar } from '../sidebar/sidebar';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-menubar',
  imports: [NgIcon, PopoverModule, Sidebar, TranslatePipe],
  templateUrl: './menubar.html',
  styleUrl: './menubar.css',
  viewProviders: [provideIcons({ lucideX, lucideMenu, lucideUser, lucideLogOut })],
})
export class Menubar {
  protected openSideMenu = false;
  protected showDropdown = false;
  private authService = inject(AuthService);

  protected user = this.authService.user();

  protected toggleSideMenu(): void {
    this.openSideMenu = !this.openSideMenu;
  }

  protected toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  protected onLogOut(): void {
    this.authService.logout().subscribe();
  }

  protected onSidebarClose() {
    this.openSideMenu = false;
  }
}
