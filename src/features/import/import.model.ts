// src/features/import/import.model.ts
export type ImportJobStatus = "Pendente" | "Processando" | "Concluido" | "Falha";

export interface ImportJobDTO {
  id: string;
  fileName: string;
  uploadedAt: string;
  status: ImportJobStatus;
  totalRows: number;
  importedRows: number;
  errorsCount: number;
  periodStartUtc?: string | null;
  periodEndUtc?: string | null;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface ImportErrorDTO {
  id: string;
  importJobId: string;
  lineNumber: number;
  error: string;
  rawLineJson?: string | null;
  createdAt: string;
}

export const BrokerResolutionMode = {
  FromScreen: 1,
  FromFile: 2,
} as const;

export type BrokerResolutionMode =
  (typeof BrokerResolutionMode)[keyof typeof BrokerResolutionMode];

// ===== DTOs usados no modal/serviço =====
export type WalletDTO = { id: string; name: string };
export type BrokerDTO = { id: string; name: string };

// 🌱 novo: request mínimo que o backend aceita
export type ProcessImportJobRequest = {
  walletId: string;
  brokerMode: BrokerResolutionMode;
  brokerId?: string | null;
};

// Mantém o report se você quiser usar depois
export type ProcessReportDTO = {
  importJobId: string;
  startedAt: string;
  finishedAt: string;
  processed: number;
  skipped: number;
  errors: number;
  byType: Record<string, { processed: number; skipped: number; errors: number }>;
  missing: {
    assets: { ticker: string; count: number }[];
    brokers: { broker: string; count: number }[];
    walletForBroker: string[];
  };
};
