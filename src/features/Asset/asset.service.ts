// src/features/asset/asset.service.ts
import { api } from "../../shared/services/api";
import type { PagedResult } from "../../shared/types/api";
import type { AssetDTO, CreateAssetCommand, UpdateAssetCommand } from "./asset.model";

// export function getAssets() {
//   return api.get<AssetDTO[]>("Assets");
// }

export function getAssets(params?: Record<string, string | number | undefined>) {
  return api.get<PagedResult<AssetDTO>>("Assets", { params });
}

export function getAsset(id: string) {
  return api.get<AssetDTO>(`Assets/${id}`);
}

export function createAsset(data: CreateAssetCommand) {
  return api.post<string>("Assets", data);
}

export function updateAsset(data: UpdateAssetCommand) {
  return api.put<string>(`Assets/${data.id}`, data);
}

export function deleteAsset(id: string) {
  return api.delete<string>(`Assets/${id}`);
}
