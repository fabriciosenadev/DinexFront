import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OperationService } from '../../../core/services/operation.service';
import { NotificationService } from '../../../core/services/notification.service';
import { FeedbackMessagesService } from '../../../core/services/feedback-messages.service';
import { Operation, OperationType } from '../../../core/models/operation.model';

@Component({
  selector: 'app-operation-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './operation-list.component.html',
  styleUrls: ['./operation-list.component.scss'],
})
export class OperationListComponent implements OnInit {
  operations: Operation[] = [];
  loading = false;

  constructor(
    private operationService: OperationService,
    private notification: NotificationService,
    private feedback: FeedbackMessagesService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.operationService.getAll().subscribe({
      next: (data) => {
        this.operations = data;
        this.loading = false;
      },
      error: () => {
        this.notification.error(this.feedback.get('operation', 'loadError'));
        this.loading = false;
      },
    });
  }

  resolveTypeLabel(type: OperationType): string {
    return type === OperationType.Buy ? 'Compra' : 'Venda';
  }
}
