import { api } from "../../shared/services/api";

export interface WalletDTO {
  id: string;
  userId: string;
  name: string;
  description?: string;
  defaultCurrency: string;
}

export interface CreateWalletCommand {
  userId: string;
  name: string;
  defaultCurrency: string;
  description?: string;
}

export interface UpdateWalletCommand {
  id: string;
  userId: string;
  name: string;
  defaultCurrency: string;
  description?: string;
}

// GET /v1/Wallets
export function getWallets() {
  return api.get<WalletDTO[]>("Wallets/user");
}

// GET /v1/Wallets/{id}
export function getWallet(id: string) {
  return api.get<WalletDTO>(`Wallets/${id}`);
}

// POST /v1/Wallets
export function createWallet(data: CreateWalletCommand) {
  return api.post<string>("Wallets", data);
}

// PUT /v1/Wallets/{id}
export function updateWallet(data: UpdateWalletCommand) {
  return api.put<string>(`Wallets/${data.id}`, data);
}

// DELETE /v1/Wallets/{id}
export function deleteWallet(id: string) {
  return api.delete<string>(`Wallets/${id}`);
}
