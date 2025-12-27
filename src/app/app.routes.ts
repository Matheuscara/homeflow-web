import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: 'family/setup',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/family/setup/setup.component').then(m => m.SetupComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'tasks',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/tasks/task-list/task-list.component').then(m => m.TaskListComponent)
      },
      {
        path: 'create',
        loadComponent: () => import('./pages/tasks/task-form/task-form.component').then(m => m.TaskFormComponent)
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./pages/tasks/task-form/task-form.component').then(m => m.TaskFormComponent)
      }
    ]
  },
  {
    path: 'family',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/family/family-details/family-details.component').then(m => m.FamilyDetailsComponent)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
