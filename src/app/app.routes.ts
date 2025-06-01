import { Routes } from '@angular/router';
import { LoginComponent } from './features/user/login/login.component';
import { AuthGuard } from './core/services/auth.guard';
import { WalletFormComponent } from './features/wallets/wallet-form/wallet-form.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'wallets',
    loadComponent: () =>
      import('./features/wallets/wallet-list/wallet-list.component').then(m => m.WalletListComponent),
    canActivate: [AuthGuard],
  },
  { path: 'wallets/new', component: WalletFormComponent },
  { path: 'wallets/:id', component: WalletFormComponent },
  { path: '', redirectTo: 'wallets', pathMatch: 'full' },
  { path: '**', redirectTo: 'wallets' },
];
