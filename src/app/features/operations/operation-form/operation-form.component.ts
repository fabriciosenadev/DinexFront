import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OperationType } from '../../../core/models/operation.model';
import { Wallet } from '../../../core/models/wallet.model';
import { Asset } from '../../../core/models/asset.model';
import { WalletService } from '../../../core/services/wallet.service';
import { AssetService } from '../../../core/services/asset.service';
import { OperationService } from '../../../core/services/operation.service';

@Component({
  selector: 'app-operation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './operation-form.component.html',
  styleUrls: ['./operation-form.component.scss'],
})
export class OperationFormComponent implements OnInit {
  form: FormGroup;
  operationTypes = Object.entries(OperationType).filter(([key]) => isNaN(Number(key)));
  isEditing = false;
  operationId: string | null = null;
  loading = false;

  wallets: Wallet[] = [];
  assets: Asset[] = [];
  brokers: { id: string, name: string }[] = []; // simulado

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private walletService: WalletService,
    private assetService: AssetService,
    private operationService: OperationService,
  ) {
    this.form = this.fb.group({
      walletId: ['', Validators.required],
      assetId: ['', Validators.required],
      brokerId: [''],
      type: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(0.000001)]],
      unitPrice: [null, [Validators.required, Validators.min(0.000001)]],
      executedAt: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.walletService.getUserWallets().subscribe({
      next: (data) => this.wallets = data,
      error: () => console.warn('Erro ao carregar carteiras.')
    });

    this.assetService.getAll().subscribe({
      next: (data) => this.assets = data,
      error: () => console.warn('Erro ao carregar ativos.')
    });

    // Simulando corretoras
    this.brokers = [
      { id: '1', name: 'XP' },
      { id: '2', name: 'Clear' }
    ];

    this.operationId = this.route.snapshot.paramMap.get('id');
    this.isEditing = !!this.operationId;

    if (this.operationId && this.isValidUuid(this.operationId)) {
      this.isEditing = true;

      this.operationService.getById(this.operationId).subscribe({
        next: (operation) => {
          const patchedOperation = {
            ...operation,
            type: operation.type,
            executedAt: operation.executedAt.split('T')[0], // para o input date
          };

          this.form.patchValue(patchedOperation);
        },
        error: () => {
          console.error('Erro ao carregar operação');
          this.router.navigate(['/operations']);
        }
      });
    }

  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const rawData = this.form.value;

    // Certifique-se que os valores estão corretos para envio
    const data = {
      ...rawData,
      brokerId: rawData.brokerId || null,
      executedAt: new Date(rawData.executedAt).toISOString(),
      type: Number(rawData.type) // pode vir como string do select
    };

    if (this.isEditing && this.operationId) {
      this.operationService.update(this.operationId, {
        id: this.operationId,
        ...data
      }).subscribe({
        next: () => {
          this.router.navigate(['/operations']);
          this.loading = false;
        },
        error: () => {
          console.error('Erro ao atualizar operação');
          this.loading = false;
        }
      });
    } else {
      this.operationService.create(data).subscribe({
        next: () => {
          this.router.navigate(['/operations']);
          this.loading = false;
        },
        error: () => {
          console.error('Erro ao criar operação');
          this.loading = false;
        }
      });
    }
  }


  cancel(): void {
    this.router.navigate(['/operations']);
  }

  //#region
  private isValidUuid(id: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  }
  //#endregion
}
