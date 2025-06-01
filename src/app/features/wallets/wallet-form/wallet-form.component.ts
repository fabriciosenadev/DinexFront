import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WalletService } from '../../../core/services/wallet.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wallet-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './wallet-form.component.html',
  styleUrls: ['./wallet-form.component.scss'],
})
export class WalletFormComponent {
  form: FormGroup;
  currencies = ['BRL', 'USD', 'EUR'];

  constructor(
    private fb: FormBuilder,
    private walletService: WalletService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      defaultCurrency: ['', Validators.required],
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.walletService.createWallet(this.form.value).subscribe({
        next: () => this.router.navigate(['/wallets']),
        error: () => {
          console.error('Erro ao criar carteira.');
          // (opcional) mostrar erro visual
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  cancel(): void {
    this.router.navigate(['/wallets']);
  }
}
