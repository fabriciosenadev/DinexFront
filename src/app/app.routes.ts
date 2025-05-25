import { Routes } from '@angular/router';
import { LoginComponent } from './features/user/login/login.component';
import { AuthGuard } from './core/services/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'wallets',
    loadComponent: () =>
      import('./features/wallets/wallet-list/wallet-list.component').then(m => m.WalletListComponent),
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: 'wallets', pathMatch: 'full' },
  { path: '**', redirectTo: 'wallets' },
];
