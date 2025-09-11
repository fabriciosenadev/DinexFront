// src/features/import/import.service.ts
import { api } from "../../shared/services/api";
import type { ImportJobDTO } from "./import.model";

// ✅ tipos necessários pro endpoint de erros
export type PagedResult<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
};

export type ImportErrorDTO = {
  id: string;
  importJobId: string;
  lineNumber: number;
  error: string;
  rawLineJson?: string | null;
  createdAt: string;
};

// src/features/import/import.service.ts
export type UploadResponse = { data: string }; // ou { id: string }

export async function uploadB3Statement(file: File): Promise<UploadResponse> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch("/v1/ImportJobs/b3", {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Falha no upload (${res.status}) ${body}`);
  }

  // **Escolha um formato e mantenha. Exemplo usando { data: string }**
  const json = await res.json() as { data?: string; id?: string; };
  const data = json.data ?? json.id;
  if (!data) throw new Error("Resposta do servidor sem 'data' ou 'id'.");
  return { data };
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
