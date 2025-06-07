import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetService } from '../../../core/services/asset.service';
import { NotificationService } from '../../../core/services/notification.service';
import { FeedbackMessagesService } from '../../../core/services/feedback-messages.service';
import { Asset, AssetType, Currency, Exchange } from '../../../core/models/asset.model';

@Component({
  selector: 'app-asset-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './asset-form.component.html',
  styleUrls: ['./asset-form.component.scss'],
})
export class AssetFormComponent implements OnInit {
  form: FormGroup;
  isEditing = false;
  assetId: string | null = null;
  loading = false;

  assetTypes = Object.entries(AssetType).filter(([key]) => isNaN(Number(key)));
  currencies = Object.entries(Currency).filter(([key]) => isNaN(Number(key)));
  exchanges = Object.entries(Exchange).filter(([key]) => isNaN(Number(key)));


  constructor(
    private fb: FormBuilder,
    private assetService: AssetService,
    private notification: NotificationService,
    private feedback: FeedbackMessagesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      cnpj: [''],
      exchange: ['', Validators.required],
      currency: ['', Validators.required],
      type: ['', Validators.required],
      sector: ['']
    });
  }

  ngOnInit(): void {
    this.assetId = this.route.snapshot.paramMap.get('id');

    if (this.assetId && !this.isValidUuid(this.assetId)) {
      this.notification.error('ID de ativo inválido.');
      this.router.navigate(['/assets']);
      return;
    }

    if (this.assetId) {
      this.isEditing = true;
      this.assetService.getById(this.assetId).subscribe({
        next: (asset) => {
          const patchedAsset = {
            ...asset,
            exchange: Exchange[asset.exchange as unknown as keyof typeof Exchange],
            currency: Currency[asset.currency as unknown as keyof typeof Currency],
            type: AssetType[asset.type as unknown as keyof typeof AssetType],
          };

          this.form.patchValue(patchedAsset);
        },
        error: () => {
          this.notification.error(this.feedback.get('asset', 'loadError'));
          this.router.navigate(['/assets']);
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
    const data = {
      ...this.form.value,
      exchange: Number(this.form.value.exchange),
      currency: Number(this.form.value.currency),
      type: Number(this.form.value.type),
    };

    if (this.isEditing && this.assetId) {
      this.assetService.update(this.assetId, {
        id: this.assetId,
        ...data
      }).subscribe({
        next: () => {
          this.notification.success(this.feedback.get('asset', 'updateSuccess'));
          this.router.navigate(['/assets']);
          this.loading = false;
        },
        error: () => {
          this.notification.error(this.feedback.get('asset', 'updateError'));
          this.loading = false;
        }
      });
    } else {
      this.assetService.create(data).subscribe({
        next: () => {
          this.notification.success(this.feedback.get('asset', 'createSuccess'));
          this.router.navigate(['/assets']);
          this.loading = false;
        },
        error: () => {
          this.notification.error(this.feedback.get('asset', 'createError'));
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/assets']);
  }

  //#region private
  private isValidUuid(id: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  }
  //#endregion
}
