export enum OperationType {
  Buy = 1,
  Sell = 2
}

export interface Operation {
  id: string;
  walletId: string;
  assetId: string;
  brokerId?: string;
  type: OperationType;
  quantity: number;
  unitPrice: number;
  executedAt: string; // ISO string (ex: '2025-06-10T14:00:00Z')
  totalValue?: number; // apenas leitura
}
