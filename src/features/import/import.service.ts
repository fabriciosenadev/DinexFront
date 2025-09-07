// src/features/import/import.service.ts
import { api } from "../../shared/services/api";
import type { ImportJobDTO } from "./import.model";

export async function uploadB3Statement(file: File): Promise<string> {
  const userDataRaw = localStorage.getItem("dinex:user-data");
  const userData = userDataRaw ? (JSON.parse(userDataRaw) as { id?: string }) : null;
  const userId = userData?.id;

  const form = new FormData();
  form.append("file", file);
  if (userId) form.append("userId", userId);

  // api.post fará o unwrap de { data: "<guid>" } → string
  return api.post<string, FormData>("import/b3/upload", form);
}

export async function getImportJobs(params?: {
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<ImportJobDTO[]> {
  // api.get fará o unwrap de { data: [...] } → ImportJobDTO[]
  return api.get<ImportJobDTO[]>("import/jobs", { params });
}
