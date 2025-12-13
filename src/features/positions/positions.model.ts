// src/features/positions/positions.model.ts

// This mirrors the backend PositionDTO.
// Extra fields are optional so it works even before backend enrichment.
export interface PositionDTO {
    id: string;
    walletId: string;
    assetId: string;
    brokerId?: string | null;

    currentQuantity: number;
    averagePrice: number;
    investedValue: number;

    assetName?: string | null;
    assetCode?: string | null;
    assetType?: string | null;          // or a specific string union/enum later

    walletSharePercent?: number | null; // 0–100, optional while backend is not ready
}
