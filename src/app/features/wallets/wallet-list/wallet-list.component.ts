import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { FeedbackMessagesService } from '../../../core/services/feedback-messages.service';
import { WalletService } from '../../../core/services/wallet.service';
import { Wallet } from '../../../core/models/wallet.model';

declare var bootstrap: any;

@Component({
  selector: 'app-wallet-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wallet-list.component.html',
  styleUrls: ['./wallet-list.component.scss'],
})
export class WalletListComponent implements OnInit {
  @ViewChild('deleteModal') deleteModalRef!: ElementRef;

  wallets: Wallet[] = [];
  loading = false;
  selectedWalletToDelete: Wallet | null = null;

  constructor(
    private walletService: WalletService,
    private notification: NotificationService,
    private feedback: FeedbackMessagesService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.walletService.getUserWallets().subscribe({
      next: (wallets) => {
        this.wallets = wallets;
        this.loading = false;
      },
      error: () => {
        this.notification.error(this.feedback.get('wallet', 'loadError'));
        this.loading = false;
      },
    });
  }

  confirmDelete(wallet: Wallet): void {
    this.selectedWalletToDelete = wallet;

    const modalInstance = new bootstrap.Modal(this.deleteModalRef.nativeElement);
    modalInstance.show();
  }

  deleteConfirmed(): void {
    if (!this.selectedWalletToDelete) return;

    this.walletService.deleteWallet(this.selectedWalletToDelete.id).subscribe({
      next: () => {
        this.notification.success(this.feedback.get('wallet', 'deleteSuccess'));
        this.wallets = this.wallets.filter(w => w.id !== this.selectedWalletToDelete?.id);
        this.selectedWalletToDelete = null;
      },
      error: () => {
        this.notification.error(this.feedback.get('wallet', 'deleteError'));
      },
    });
  }
}
