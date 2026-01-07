import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './features/auth/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // private authService = inject(AuthService);
  // private publicRoutes = ['/login', '/signup'];

  // ngOnInit(): void {
  //   const currentPath = window.location.pathname;

  //   if (!this.publicRoutes.some(route => currentPath.includes(route))) {
  //     this.authService.checkAuth().subscribe();
  //   }

  // }
}
