// src/features/operation/operation.model.ts

// 1. Opções de operação (enum numerado, union literal)
export const OPERATION_TYPE_OPTIONS = [
  { value: 1, label: "Compra", backend: "Buy" },
  { value: 2, label: "Venda", backend: "Sell" },
] as const;

export type OperationType = typeof OPERATION_TYPE_OPTIONS[number]["value"];

// 2. DTO retornado pelo backend (atenção: Type é string, como vem do backend)
export interface OperationDTO {
    id: string;
    walletId: string;
    assetId: string;
    brokerId?: string;
    type: string;           // "Buy" ou "Sell"
    quantity: number;
    unitPrice: number;
    totalValue: number;
    executedAt: string;     // formato ISO: "2025-07-01T15:45:00.000Z"
}

// 3. Comandos para envio ao backend (Type é union literal numérica)
export interface CreateOperationCommand {
    walletId: string;
    assetId: string;
    brokerId?: string;
    type: OperationType;    // 1 | 2
    quantity: number;
    unitPrice: number;
    executedAt: string;     // formato ISO
}

export interface UpdateOperationCommand {
    id: string;
    walletId: string;
    assetId: string;
    brokerId?: string;
    type: OperationType;    // 1 | 2
    quantity: number;
    unitPrice: number;
    executedAt: string;     // formato ISO
}
