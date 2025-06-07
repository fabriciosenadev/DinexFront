import { Routes } from '@angular/router';
import { WalletListComponent } from './wallet-list/wallet-list.component';
import { WalletFormComponent } from './wallet-form/wallet-form.component';

export const walletsRoutes: Routes = [
  {
    path: '',
    component: WalletListComponent,
  },
  {
    path: 'new',
    component: WalletFormComponent,
  },
  {
    path: ':id',
    component: WalletFormComponent,
  }
];
