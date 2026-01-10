import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { AuthForm } from './features/auth/auth-form/auth-form';
import { guestGuard } from './guards/guest-guard';
import { AuthLayout } from './layout/auth-layout/auth-layout';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
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
        // canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                component: MainLayout
            },
            {
                path: 'expense',
                loadComponent: () => import('./expense/expense').then(m => m.Expense)
            },
            {
                path: 'income',
                loadComponent: () => import('./income/income').then(m => m.Income)
            },
            {
                path: 'category',
                loadComponent: () => import('./category/category').then(m => m.Category)
            },
            {
                path: 'filter',
                loadComponent: () => import('./filter/filter').then(m => m.Filter)
            }
        ]
    }





];
