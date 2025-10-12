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
