import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BrokerService } from '../../../core/services/broker.service';
import { NotificationService } from '../../../core/services/notification.service';
import { FeedbackMessagesService } from '../../../core/services/feedback-messages.service';

@Component({
  selector: 'app-broker-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './broker-form.component.html',
  styleUrls: ['./broker-form.component.scss'],
})
export class BrokerFormComponent implements OnInit {
  form: FormGroup;
  isEditing = false;
  brokerId: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private brokerService: BrokerService,
    private notification: NotificationService,
    private feedback: FeedbackMessagesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      cnpj: [''],
      website: ['']
    });
  }

  ngOnInit(): void {
    this.brokerId = this.route.snapshot.paramMap.get('id');
    if (this.brokerId && this.isValidUuid(this.brokerId)) {
      this.isEditing = true;
      this.brokerService.getById(this.brokerId).subscribe({
        next: (broker) => {
          this.form.patchValue(broker);
        },
        error: () => {
          this.notification.error(this.feedback.get('broker', 'loadError'));
          this.router.navigate(['/brokers']);
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
    const data = this.form.value;

    if (this.isEditing && this.brokerId) {
      this.brokerService.update(this.brokerId, {
        id: this.brokerId,
        ...data
      }).subscribe({
        next: () => {
          this.notification.success(this.feedback.get('broker', 'updateSuccess'));
          this.router.navigate(['/brokers']);
          this.loading = false;
        },
        error: () => {
          this.notification.error(this.feedback.get('broker', 'updateError'));
          this.loading = false;
        }
      });
    } else {
      this.brokerService.create(data).subscribe({
        next: () => {
          this.notification.success(this.feedback.get('broker', 'createSuccess'));
          this.router.navigate(['/brokers']);
          this.loading = false;
        },
        error: () => {
          this.notification.error(this.feedback.get('broker', 'createError'));
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/brokers']);
  }

  private isValidUuid(id: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  }
}
