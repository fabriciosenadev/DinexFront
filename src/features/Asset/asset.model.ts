// src/features/asset/asset.model.ts

import type { AssetType, Currency, Exchange } from "./asset.enums";

// DTOs: ajuste para usar os enums corretos (number, não string)
export interface AssetDTO {
  id: string;
  name: string;
  code: string;
  cnpj?: string;
  exchange: string;
  currency: string;
  type: string;
  sector?: string;
}

export interface CreateAssetCommand {
  name: string;
  code: string;
  cnpj?: string;
  exchange: Exchange;
  currency: Currency;
  type: AssetType;
  sector?: string;
}

export interface UpdateAssetCommand {
  id: string;
  name: string;
  code: string;
  cnpj?: string;
  exchange: Exchange;
  currency: Currency;
  type: AssetType;
  sector?: string;
}
