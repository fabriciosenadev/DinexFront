import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { WalletListComponent } from './features/wallets/wallet-list/wallet-list.component';
import { WalletFormComponent } from './features/wallets/wallet-form/wallet-form.component';
import { LoginComponent } from './features/user/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'wallets', component: WalletListComponent },
      { path: 'wallets/new', component: WalletFormComponent },
      { path: 'wallets/:id', component: WalletFormComponent },
      // futuras rotas protegidas
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'login' },
];
