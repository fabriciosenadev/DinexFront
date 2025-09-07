// src/features/import/import.model.ts
export type ImportJobStatus = "Pendente" | "Processando" | "Concluido" | "Falha";

export interface ImportJobDTO {
  id: string;
  fileName: string;
  uploadedAt: string;        // ISO vindo do backend
  status: ImportJobStatus;   // backend devolve em PT-BR
  totalRows?: number;
  importedRows?: number;
  errorsCount?: number;
}

