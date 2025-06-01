import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoCardComponent } from '../../shared/components/info-card/info-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, InfoCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {}
