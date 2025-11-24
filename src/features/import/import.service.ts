// src/features/import/import.service.ts
import { api } from "../../shared/services/api";
import type {
  ImportJobDTO,
  ProcessImportJobRequest,
  ProcessReportDTO,
} from "./import.model";


// ✅ tipos necessários pro endpoint de erros
export type PagedResult<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
};

export type ImportErrorDTO = {
  id: string;              // id do erro
  importJobId: string;
  lineNumber: number;
  error: string;
  rawLineJson?: string | null;
  createdAt: string;
  rowId?: string;          // ← id da linha
};

// Tipagem do wrapper
export type ApiResponse<T> = {
  notifications: { key: string; message: string }[];
  isValid: boolean;
  errors: string[];
  succeded: boolean;
  isNotFound: boolean;
  internalServerError: boolean;
  data: T;
};

// DTO da linha (como você mostrou)
export type ImportRowForEditDTO = {
  id: string;
  importJobId: string;
  rowNumber: number;
  asset: string | null;
  operationType: string | null;
  movement: string | null;
  date: string | null;
  dueDate: string | null;
  quantity: number | null;
  unitPrice: number | null;
  totalValue: number | null;
  broker: string | null;
  rawLineJson: string | null;
  status: string | null;
  error: string | null;
  createdAt: string;
  updatedAt: string | null;
};

// src/features/import/import.service.ts
export type UploadResponse = { data: string }; // ou { id: string }

export async function uploadB3Statement(file: File): Promise<UploadResponse> {
  const form = new FormData();
  form.append("file", file); // o backend espera "file"

  // O api.post já:
  // - injeta Authorization: Bearer <token>
  // - NÃO define Content-Type se for FormData (evita quebrar o boundary)
  // - desmembra envelope { data }
  const id = await api.post<string, FormData>("Import/b3/upload", form);

  // Se quiser manter a assinatura { data: string }:
  return { data: id };
}



export async function getImportJobs(params?: {
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<ImportJobDTO[]> {
  return api.get<ImportJobDTO[]>("import/jobs", { params });
}

// ✅ novo: buscar erros do job
export async function getImportErrors(
  jobId: string,
  params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    orderBy?: "RowNumber" | "CreatedAt";
    desc?: boolean;
    includeRaw?: boolean;
  }
): Promise<PagedResult<ImportErrorDTO>> {
  return api.get<PagedResult<ImportErrorDTO>>(`import/${jobId}/errors`, { params });
}

export async function getImportRowForEdit(
  importId: string,
  rowId: string
): Promise<ImportRowForEditDTO> {
  return api.get<ImportRowForEditDTO>(`import/${importId}/rows/${rowId}`);
}

// src/features/import/import.service.ts
// ...
export async function deleteImportJob(id: string): Promise<boolean> {
  // Antes estava: return api.delete(`/v1/import/${id}`);
  // Corrige para NÃO duplicar /v1
  return api.delete<boolean>(`import/${id}`);
}

// POST /v1/import/{id}/process
export async function processImportJob(
  jobId: string,
  body: ProcessImportJobRequest
): Promise<ProcessReportDTO> {
  // Controller: [HttpPost("{id:guid}/process")] => /v1/import/{id}/process
  return api.post<ProcessReportDTO, ProcessImportJobRequest>(
    `import/${jobId}/process`,
    body
  );
}
