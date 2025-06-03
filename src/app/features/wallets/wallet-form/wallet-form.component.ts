import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WalletService } from '../../../core/services/wallet.service';
import { NotificationService } from '../../../core/services/notification.service';
import { FeedbackMessagesService } from '../../../core/services/feedback-messages.service';

@Component({
  selector: 'app-wallet-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './wallet-form.component.html',
  styleUrls: ['./wallet-form.component.scss'],
})
export class WalletFormComponent implements OnInit {
  form: FormGroup;
  currencies = ['BRL', 'USD', 'EUR'];
  isEditing = false;
  walletId: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private walletService: WalletService,
    private router: Router,
    private route: ActivatedRoute,
    private notification: NotificationService,
    private feedback: FeedbackMessagesService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      defaultCurrency: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.walletId = this.route.snapshot.paramMap.get('id');

    if (this.walletId && !this.isValidUuid(this.walletId)) {
      this.notification.error('ID de carteira inválido.');
      this.router.navigate(['/wallets']);
      return;
    }

    if (this.walletId) {
      this.isEditing = true;
      this.walletService.getWalletById(this.walletId).subscribe({
        next: (wallet) => {
          this.form.patchValue({
            name: wallet.name,
            description: wallet.description,
            defaultCurrency: wallet.defaultCurrency,
          });
        },
        error: () => {
          this.notification.error(this.feedback.get('wallet', 'loadError'));
          this.router.navigate(['/wallets']);
        },
      });
    }
  }

  submit(): void {
    this.loading = true;

    if (this.form.valid) {
      const data = this.form.value;

      if (this.isEditing && this.walletId) {
        this.walletService.updateWallet(this.walletId, {
          id: this.walletId,
          ...data
        }).subscribe({
          next: () => {
            this.notification.success(this.feedback.get('wallet', 'updateSuccess'));
            this.loading = false;

            this.router.navigate(['/wallets']);
          },
          error: () => {
            this.notification.error(this.feedback.get('wallet', 'updateError'));
            this.loading = false;
          },
        });
      } else {
        this.walletService.createWallet(data).subscribe({
          next: () => {
            this.notification.success(this.feedback.get('wallet', 'createSuccess'));
            this.loading = false;

            this.router.navigate(['/wallets']);
          },
          error: () => {
            this.notification.error(this.feedback.get('wallet', 'createError'));
            this.loading = false;
          },
        });
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  cancel(): void {
    this.router.navigate(['/wallets']);
  }

  //#region private methods
  private isValidUuid(id: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  }
  //#endregion
}
