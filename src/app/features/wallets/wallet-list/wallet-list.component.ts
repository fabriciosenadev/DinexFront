import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Wallet, WalletService } from '../../../core/services/wallet.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wallet-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wallet-list.component.html',
  styleUrls: ['./wallet-list.component.scss'],
})
export class WalletListComponent implements OnInit {
  wallets: Wallet[] = [];
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private walletService: WalletService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.walletService.getUserWallets().subscribe({
      next: (wallets) => {
        this.wallets = wallets;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar carteiras.';
        this.loading = false;
      },
    });
  }

  edit(walletId: number): void {
    console.log('Editar carteira:', walletId);
  }

  delete(walletId: number): void {
    console.log('Excluir carteira:', walletId);
  }

}
