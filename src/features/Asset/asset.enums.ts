// asset.enums.ts
export const EXCHANGE_OPTIONS = [
  { value: 0, label: "B3" },
  { value: 1, label: "NYSE" },
  { value: 2, label: "NASDAQ" },
  { value: 3, label: "AMEX" },
  { value: 4, label: "LSE" },
  { value: 5, label: "TSE" },
  { value: 6, label: "Outra" },
] as const;

export const CURRENCY_OPTIONS = [
  { value: 0, label: "BRL" },
  { value: 1, label: "USD" },
  { value: 2, label: "EUR" },
  { value: 3, label: "GBP" },
  { value: 4, label: "JPY" },
  { value: 5, label: "CHF" },
  { value: 6, label: "Outra" },
] as const;

export const ASSET_TYPE_OPTIONS = [
  { value: 0, label: "Acao" },
  { value: 1, label: "FII" },
  { value: 2, label: "ETF" },
  { value: 3, label: "BDR" },
  { value: 4, label: "RendaFixa" },
  { value: 5, label: "Cripto" },
  { value: 6, label: "Outro" },
] as const;

export type Exchange = typeof EXCHANGE_OPTIONS[number]["value"];
export type Currency = typeof CURRENCY_OPTIONS[number]["value"];
export type AssetType = typeof ASSET_TYPE_OPTIONS[number]["value"];
