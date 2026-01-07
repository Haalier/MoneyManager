import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Expense } from './expense/expense';
import { Income } from './income/income';
import { Category } from './category/category';
import { Filter } from './filter/filter';
import { authGuard } from './guards/auth-guard';
import { AuthForm } from './features/auth/auth-form/auth-form';

export const routes: Routes = [
    {
        path: 'login',
        component: AuthForm,
    },
    {
        path: 'signup',
        component: AuthForm,
    },

    {
        path: '',
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                component: Home
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
