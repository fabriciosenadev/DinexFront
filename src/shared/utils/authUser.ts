// src/shared/utils/authUser.ts

import type { AuthUser } from "../../features/Auth/auth.service";

export function getAuthUser(): AuthUser | null {
  const data = localStorage.getItem("dinex:user-data");
  return data ? JSON.parse(data) as AuthUser : null;
}

export function getUserId(): string | null {
  return getAuthUser()?.id ?? null;
}

export function getUserToken(): string | null {
  return getAuthUser()?.token ?? null;
}

export function getUserEmail(): string | null {
  return getAuthUser()?.email ?? null;
}
