import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { LoginComponent } from './features/user/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'wallets', loadChildren: () => import('./features/wallets/wallets.routes').then(m => m.walletsRoutes) },
      { path: 'assets', loadChildren: () => import('./features/assets/assets.routes').then(m => m.assetsRoutes) },
      {
        path: 'operations',
        loadChildren: () => import('./features/operations/operations.routes').then(m => m.operationsRoutes)
      },
      {
        path: 'brokers',
        loadChildren: () => import('./features/brokers/brokers.routes').then(m => m.brokersRoutes)
      },
      // futuras rotas protegidas
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'login' },
];
