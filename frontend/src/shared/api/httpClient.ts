import { env } from "../config/env";

type JsonPrimitive = string | number | boolean | null;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];
type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${env.apiBaseUrl}${path}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {})
      },
      ...init
    });
  } catch {
    throw new Error("Network request failed. Check that the Memora backend is reachable.");
  }

  if (response.status === 401) {
    window.dispatchEvent(new Event("memora:unauthorized"));
    throw new UnauthorizedError();
  }

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const httpClient = {
  get<T>(path: string): Promise<T> {
    return request<T>(path, { method: "GET" });
  },

  post<T>(path: string, body?: JsonValue): Promise<T> {
    return request<T>(path, {
      method: "POST",
      body: body === undefined ? undefined : JSON.stringify(body)
    });
  },

  patch<T>(path: string, body?: JsonValue): Promise<T> {
    return request<T>(path, {
      method: "PATCH",
      body: body === undefined ? undefined : JSON.stringify(body)
    });
  },

  delete<T>(path: string): Promise<T> {
    return request<T>(path, { method: "DELETE" });
  }
};

export function readableErrorMessage(error: unknown, fallback = "Action failed"): string {
  if (error instanceof Error && error.message.trim()) return error.message;
  return fallback;
}

async function parseErrorMessage(response: Response): Promise<string> {
  const contentType = response.headers.get("Content-Type") ?? "";
  const text = await response.text();
  if (contentType.toLowerCase().includes("application/json")) {
    try {
      const body = JSON.parse(text);
      const message = extractJsonErrorMessage(body);
      if (message) return message;
    } catch {
      return text || `Request failed with ${response.status}`;
    }
  }

  return text || `Request failed with ${response.status}`;
}

function extractJsonErrorMessage(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  for (const key of ["message", "error"]) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return null;
}
