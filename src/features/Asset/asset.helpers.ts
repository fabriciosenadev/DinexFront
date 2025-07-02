// src/features/asset/asset.helpers.ts
import { EXCHANGE_OPTIONS, CURRENCY_OPTIONS, ASSET_TYPE_OPTIONS } from "./asset.enums";

// Label para value
export function labelToExchange(label: string) {
  return EXCHANGE_OPTIONS.find(opt => opt.label === label)?.value ?? 0;
}
export function labelToCurrency(label: string) {
  return CURRENCY_OPTIONS.find(opt => opt.label === label)?.value ?? 0;
}
export function labelToAssetType(label: string) {
  return ASSET_TYPE_OPTIONS.find(opt => opt.label === label)?.value ?? 0;
}

// Value para label
export function exchangeToLabel(value: number) {
  return EXCHANGE_OPTIONS.find(opt => opt.value === value)?.label ?? "";
}
export function currencyToLabel(value: number) {
  return CURRENCY_OPTIONS.find(opt => opt.value === value)?.label ?? "";
}
export function assetTypeToLabel(value: number) {
  return ASSET_TYPE_OPTIONS.find(opt => opt.value === value)?.label ?? "";
}
