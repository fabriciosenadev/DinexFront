import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WalletService } from '../../../core/services/wallet.service';

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

  constructor(
    private fb: FormBuilder,
    private walletService: WalletService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      defaultCurrency: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.walletId = this.route.snapshot.paramMap.get('id');
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
          console.error('Erro ao carregar carteira.');
          this.router.navigate(['/wallets']);
        },
      });
    }
  }

  submit(): void {
    if (this.form.valid) {
      const data = this.form.value;
      if (this.isEditing && this.walletId) {
        this.walletService.updateWallet(this.walletId, data).subscribe({
          next: () => this.router.navigate(['/wallets']),
          error: () => console.error('Erro ao atualizar carteira.'),
        });
      } else {
        this.walletService.createWallet(data).subscribe({
          next: () => this.router.navigate(['/wallets']),
          error: () => console.error('Erro ao criar carteira.'),
        });
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  cancel(): void {
    this.router.navigate(['/wallets']);
  }
}
