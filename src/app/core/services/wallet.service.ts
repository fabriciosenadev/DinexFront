import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Wallet {
  id: string;
  userId: string;
  name: string;
  description?: string;
  defaultCurrency: string;
}

@Injectable({ providedIn: 'root' })
export class WalletService {
  constructor(private api: ApiService) {}

  getUserWallets(): Observable<Wallet[]> {
    return this.api.get<Wallet[]>('wallets/user');
  }
}
