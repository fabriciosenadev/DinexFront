// Interface principal
export interface Asset {
  id: string;
  name: string;
  code: string;
  cnpj?: string;
  exchange: Exchange;
  currency: Currency;
  type: AssetType;
  sector?: string;
}

// Enums
export enum Exchange {
  B3 = 0,
  NYSE = 1,
  NASDAQ = 2,
  AMEX = 3,
  LSE = 4,
  TSE = 5,
  Outra = 6,
}

export enum Currency {
  BRL = 0,
  USD = 1,
  EUR = 2,
  GBP = 3,
  JPY = 4,
  CHF = 5,
  Outra = 6,
}

export enum AssetType {
  Acao = 0,
  FII = 1,
  ETF = 2,
  BDR = 3,
  RendaFixa = 4,
  Cripto = 5,
  Outro = 6,
}

