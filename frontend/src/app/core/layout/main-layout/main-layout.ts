import { Component, inject } from '@angular/core';
import { Menubar } from "../menubar/menubar";
import { Sidebar } from "../sidebar/sidebar";
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../../features/auth/auth-service';

@Component({
  selector: 'app-main-layout',
  imports: [Menubar, Sidebar, RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  private authService = inject(AuthService);

  protected user = this.authService.user;
}
