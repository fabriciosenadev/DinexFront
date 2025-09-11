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

export async function uploadB3Statement(file: File): Promise<string> {
  const userDataRaw = localStorage.getItem("dinex:user-data");
  const userData = userDataRaw ? (JSON.parse(userDataRaw) as { id?: string }) : null;
  const userId = userData?.id;

  const form = new FormData();
  form.append("file", file);
  if (userId) form.append("userId", userId);

  return api.post<string, FormData>("import/b3/upload", form);
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
