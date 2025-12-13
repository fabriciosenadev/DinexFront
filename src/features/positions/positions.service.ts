// src/features/positions/positions.service.ts
import type { PositionDTO } from "./positions.model";
import { api } from "../../shared/services/api"; // ajuste o caminho conforme seu projeto

// This service fetches all positions for a given wallet.
export async function getPositionsByWallet(walletId: string): Promise<PositionDTO[]> {
    const response = await api.get<PositionDTO[]>(`/Positions/wallet/${walletId}`);
    return response ?? [];
}
