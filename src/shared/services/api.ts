// src/shared/services/api.ts
import { getUserToken } from "../utils/authUser";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  headers?: HeadersInit;
}

type ApiEnvelope<T> = { data: T };

const API_URL =
  (import.meta.env?.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ||
  "https://localhost:5001/v1";

function buildQuery(params?: RequestOptions["params"]): string {
  if (!params) return "";
  const query = Object.entries(params)
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
  return query ? `?${query}` : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isDataEnvelope<T>(value: unknown): value is ApiEnvelope<T> {
  return isRecord(value) && "data" in value;
}

interface ErrorEnvelope {
  message?: string;
  Errors?: unknown;
}
function isErrorEnvelope(value: unknown): value is ErrorEnvelope {
  return isRecord(value) && ("message" in value || "Errors" in value);
}

async function request<T, B = unknown>(
  path: string,
  method: HttpMethod,
  body?: B,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers, ...rest } = options;
  const url = `${API_URL}/${path.replace(/^\/+/, "")}${buildQuery(params)}`;
  const token = getUserToken();

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const baseHeaders: HeadersInit = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers ?? {}),
  };

  const config: RequestInit = {
    method,
    headers: baseHeaders,
    ...rest,
    body:
      body === undefined
        ? undefined
        : isFormData
          ? (body as unknown as BodyInit) // BodyInit é aceito pelo fetch
          : JSON.stringify(body),
  };

  const response = await fetch(url, config);
  const raw = await response.text();

  if (!response.ok) {
    let message = response.statusText || "Erro desconhecido";
    try {
      const parsed: unknown = raw ? JSON.parse(raw) : undefined;
      if (isErrorEnvelope(parsed)) {
        if (typeof parsed.message === "string" && parsed.message.trim()) {
          message = parsed.message;
        } else if (
          Array.isArray(parsed.Errors) &&
          typeof parsed.Errors[0] === "string"
        ) {
          message = parsed.Errors[0];
        }
      } else if (raw) {
        message = raw;
      }
    } catch {
      if (raw) message = raw;
    }
    throw new Error(message);
  }

  // 204 / sem corpo
  if (!raw) return undefined as unknown as T;

  const parsed: unknown = JSON.parse(raw);
  // Desembrulha envelope { data } automaticamente, mantendo compatibilidade
  if (isDataEnvelope<T>(parsed)) {
    return (parsed as ApiEnvelope<T>).data;
  }
  return parsed as T;
}

export const api = {
  get:  <T>(path: string, options?: RequestOptions) =>
    request<T>(path, "GET", undefined, options),
  post: <T, B = unknown>(path: string, body: B, options?: RequestOptions) =>
    request<T, B>(path, "POST", body, options),
  put:  <T, B = unknown>(path: string, body: B, options?: RequestOptions) =>
    request<T, B>(path, "PUT", body, options),
  patch:<T, B = unknown>(path: string, body: B, options?: RequestOptions) =>
    request<T, B>(path, "PATCH", body, options),
  delete:<T>(path: string, options?: RequestOptions) =>
    request<T>(path, "DELETE", undefined, options),
};
