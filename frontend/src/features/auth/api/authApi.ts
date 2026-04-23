import { httpClient } from "../../../shared/api/httpClient";

export type SessionState = {
  authenticated: boolean;
};

export async function login(password: string): Promise<void> {
  await httpClient.post("/api/auth/login", { password });
}

export async function logout(): Promise<void> {
  await httpClient.post("/api/auth/logout");
}

export async function fetchSession(): Promise<SessionState> {
  return httpClient.get<SessionState>("/api/auth/session");
}
