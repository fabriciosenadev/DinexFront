import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard.service';
import { InfoCardComponent } from '../../shared/components/info-card/info-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, InfoCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  cards: {
    title: string;
    value: string;
    icon: string;
    colorClass: string;
  }[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getDashboardData().subscribe(data => {
      this.cards = [
        {
          title: 'Minhas Carteiras',
          value: `${data.walletCount}`,
          icon: 'bi-wallet2',
          colorClass: 'primary',
        },
        {
          title: 'Ativos',
          value: `${data.assetCount}`,
          icon: 'bi-graph-up',
          colorClass: 'success',
        },
        {
          title: 'Saldo Total',
          value: `R$ ${data.totalBalance.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
          })}`,
          icon: 'bi-currency-dollar',
          colorClass: 'info',
        },
      ];
    });
  }
}
