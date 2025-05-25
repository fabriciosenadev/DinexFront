import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wallet-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wallet-list.component.html',
  styleUrls: ['./wallet-list.component.scss'],
})
export class WalletListComponent implements OnInit {
  wallets = [
    { id: 1, name: 'Carteira Principal', balance: 15000.00 },
    { id: 2, name: 'Carteira Internacional', balance: 8200.50 },
  ];

  constructor() {}

  ngOnInit(): void {}

  edit(walletId: number): void {
    console.log('Editar carteira:', walletId);
  }

  delete(walletId: number): void {
    console.log('Excluir carteira:', walletId);
  }

}
