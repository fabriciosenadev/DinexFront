import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card shadow-sm h-100">
      <div class="card-body d-flex flex-column justify-content-between">
        <div>
          <div class="d-flex align-items-center gap-2 mb-2">
            <i *ngIf="icon" class="bi" [ngClass]="icon"></i>
            <h6 class="card-title mb-0">{{ title }}</h6>
          </div>
          <p class="card-text fs-5 fw-semibold">{{ value }}</p>
        </div>
        <small *ngIf="subtitle" class="text-muted">{{ subtitle }}</small>
      </div>
    </div>
  `,
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent {
  @Input() title!: string;
  @Input() value!: string;
  @Input() icon?: string;
  @Input() subtitle?: string;
}
