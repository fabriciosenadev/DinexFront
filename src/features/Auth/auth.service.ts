// src/features/Auth/auth.service.ts

import { api } from "../../shared/services/api";

type LoginResponse = AuthUser;

interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  token: string;
}

export async function login(email: string, password: string) {
  return api.post<LoginResponse, LoginRequest>("users/login", { email, password });
}
