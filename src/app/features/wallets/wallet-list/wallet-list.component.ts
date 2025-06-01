import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Wallet, WalletService } from '../../../core/services/wallet.service';
import { RouterLink } from '@angular/router';

declare var bootstrap: any;

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
  selectedWalletToDelete: Wallet | null = null;

  constructor(
    private walletService: WalletService,
  ) { }

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

  confirmDelete(wallet: Wallet): void {
    this.selectedWalletToDelete = wallet;

    const modalElement = document.getElementById('deleteModal');
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  }

  deleteConfirmed(): void {
    if (!this.selectedWalletToDelete) return;

    this.walletService.deleteWallet(this.selectedWalletToDelete.id).subscribe({
      next: () => {
        this.wallets = this.wallets.filter(w => w.id !== this.selectedWalletToDelete?.id);
        this.selectedWalletToDelete = null;
      },
      error: () => {
        console.error('Erro ao excluir carteira.');
      },
    });
  }

}
