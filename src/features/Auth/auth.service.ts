// src/features/Auth/auth.service.ts

import { api } from "../../shared/services/api";

interface LoginResponse {
  token: string;
  // Adicione outros campos que seu backend retornar (user, refreshToken, etc)
}

interface LoginRequest {
  email: string;
  password: string;
}

export async function login(email: string, password: string) {
  return api.post<LoginResponse, LoginRequest>("users/login", { email, password });
}
