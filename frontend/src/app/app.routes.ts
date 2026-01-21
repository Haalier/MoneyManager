import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { AuthForm } from './features/auth/auth-form/auth-form';
import { guestGuard } from './core/guards/guest-guard';


import { inject } from '@angular/core';
import { AuthService } from './features/auth/auth-service';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { AuthLayout } from './core/layout/auth-layout/auth-layout';


export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: () => {
            const authService = inject(AuthService);
            return authService.isLoggedIn() ? 'dashboard' : 'login';
        }
    },
    {
        path: '',
        component: AuthLayout,
        children: [
            {
                path: 'login',
                component: AuthForm,
            },
            {
                path: 'signup',
                component: AuthForm,
            },
        ]
    },



    {
        path: '',
        component: MainLayout,
        // canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./features/home/home').then(m => m.Home)

            },
            {
                path: 'expense',
                loadComponent: () => import('./features/expense/expense').then(m => m.Expense)
            },
            {
                path: 'income',
                loadComponent: () => import('./features/income/income').then(m => m.Income)
            },
            {
                path: 'category',
                loadComponent: () => import('./features/category/category').then(m => m.Category)
            },
            {
                path: 'filter',
                loadComponent: () => import('./features/filter/filter').then(m => m.Filter)
            }
        ]
    }





];
