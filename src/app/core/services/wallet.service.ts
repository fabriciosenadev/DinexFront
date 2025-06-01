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

  getWalletById(id: string): Observable<Wallet> {
    return this.api.get<Wallet>(`wallets/${id}`);
  }

  createWallet(data: Omit<Wallet, 'id' | 'userId'>): Observable<Wallet> {
    return this.api.post<Wallet>('wallets', data);
  }

  updateWallet(id: string, data: Omit<Wallet, 'id' | 'userId'>): Observable<void> {
    return this.api.put<void>(`wallets/${id}`, data);
  }

  deleteWallet(id: string): Observable<void> {
    return this.api.delete<void>(`wallets/${id}`);
  }
}
