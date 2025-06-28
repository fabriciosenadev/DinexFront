// src/shared/services/api.ts

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  headers?: HeadersInit;
}

const API_URL = "https://localhost:5001/v1"; // adapte conforme seu backend

function buildQuery(params?: RequestOptions["params"]) {
  if (!params) return "";
  const query = Object.entries(params)
    .filter(([, value]) => value !== null && value !== undefined)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join("&");
  return query ? `?${query}` : "";
}

async function request<T, B = unknown>(
  path: string,
  method: HttpMethod,
  body?: B,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers, ...rest } = options;
  const url = `${API_URL}/${path}${buildQuery(params)}`;
  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    ...rest,
  };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const errorMessage =
      errorBody.message || response.statusText || "Erro desconhecido";
    throw new Error(errorMessage);
  }

  return await response.json();
}

// Métodos HTTP
export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, "GET", undefined, options),
  post: <T, B = unknown>(path: string, body: B, options?: RequestOptions) =>
    request<T, B>(path, "POST", body, options),
  put: <T, B = unknown>(path: string, body: B, options?: RequestOptions) =>
    request<T, B>(path, "PUT", body, options),
  patch: <T, B = unknown>(path: string, body: B, options?: RequestOptions) =>
    request<T, B>(path, "PATCH", body, options),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, "DELETE", undefined, options),
};
