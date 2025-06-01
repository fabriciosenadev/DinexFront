import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Wallet } from './wallet.service';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private api: ApiService) {}

  getDashboardData(): Observable<{
    walletCount: number;
    assetCount: number;
    totalBalance: number;
  }> {
    return this.api.get<Wallet[]>('Wallets/user').pipe(
      map(wallets => {
        const walletCount = wallets.length;
        // const totalBalance = wallets.reduce((acc, w) => acc + (w.balance || 0), 0);
        const totalBalance = 0; // substituir quando a API de saldo estiver pronta

        return {
          walletCount,
          assetCount: 0, // substituir quando a API de ativos estiver pronta
          totalBalance,
        };
      })
    );
  }
}
