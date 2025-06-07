import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AssetService } from '../../../core/services/asset.service';
import { NotificationService } from '../../../core/services/notification.service';
import { FeedbackMessagesService } from '../../../core/services/feedback-messages.service';
import { Asset, AssetType } from '../../../core/models/asset.model';

@Component({
  selector: 'app-asset-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.scss'],
})
export class AssetListComponent implements OnInit {
  assets: Asset[] = [];
  loading = false;

  constructor(
    private assetService: AssetService,
    private notification: NotificationService,
    private feedback: FeedbackMessagesService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.assetService.getAll().subscribe({
      next: (data) => {
        this.assets = data;
        this.loading = false;
      },
      error: () => {
        this.notification.error(this.feedback.get('asset', 'loadError'));
        this.loading = false;
      },
    });
  }
}
