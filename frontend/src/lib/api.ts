export type SessionState = {
  authenticated: boolean;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    ...init
  });

  if (response.status === 401) {
    window.location.reload();
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function login(password: string): Promise<void> {
  await request<void>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ password })
  });
}

export async function logout(): Promise<void> {
  await request<void>("/api/auth/logout", {
    method: "POST"
  });
}

export async function fetchSession(): Promise<SessionState> {
  return request<SessionState>("/api/auth/session");
}

export async function fetchNeedsReview() {
  return request<any[]>("/api/review/needs-review");
}

export async function fetchFailures() {
  return request<any[]>("/api/review/failures");
}

export async function fetchApprovedItems() {
  return request<any[]>("/api/items/approved");
}
