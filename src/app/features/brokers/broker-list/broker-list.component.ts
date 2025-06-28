import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Broker } from '../../../core/models/broker.model';
import { BrokerService } from '../../../core/services/broker.service';
import { NotificationService } from '../../../core/services/notification.service';
import { FeedbackMessagesService } from '../../../core/services/feedback-messages.service';

@Component({
  selector: 'app-broker-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './broker-list.component.html',
  styleUrls: ['./broker-list.component.scss'],
})
export class BrokerListComponent implements OnInit {
  brokers: Broker[] = [];
  loading = false;

  constructor(
    private brokerService: BrokerService,
    private notification: NotificationService,
    private feedback: FeedbackMessagesService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.brokerService.getAll().subscribe({
      next: (data) => {
        this.brokers = data;
        this.loading = false;
      },
      error: () => {
        this.notification.error(this.feedback.get('broker', 'loadError'));
        this.loading = false;
      }
    });
  }
}
