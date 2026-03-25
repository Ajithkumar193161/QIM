import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { IncidentListComponent } from './features/incidents/incident-list/incident-list.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { 
        path: 'dashboard', 
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) 
      },
      { 
        path: 'incidents', 
        loadComponent: () => import('./features/incidents/incident-list/incident-list.component').then(m => m.IncidentListComponent) 
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];