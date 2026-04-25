import { describe, expect, it, vi } from "vitest";
import { httpClient, UnauthorizedError } from "./httpClient";

describe("httpClient", () => {
  it("dispatches memora:unauthorized on 401", async () => {
    const listener = vi.fn();
    window.addEventListener("memora:unauthorized", listener);
    vi.stubGlobal("fetch", () => Promise.resolve(new Response("", { status: 401 })));

    await expect(httpClient.get("/api/private")).rejects.toBeInstanceOf(UnauthorizedError);
    expect(listener).toHaveBeenCalledTimes(1);

    window.removeEventListener("memora:unauthorized", listener);
    vi.unstubAllGlobals();
  });

  it("prefers JSON message and error fields for failed responses", async () => {
    vi.stubGlobal("fetch", () =>
      Promise.resolve(new Response(JSON.stringify({ message: "Readable failure" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }))
    );
    await expect(httpClient.get("/api/bad")).rejects.toThrow("Readable failure");

    vi.stubGlobal("fetch", () =>
      Promise.resolve(new Response(JSON.stringify({ error: "Fallback error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }))
    );
    await expect(httpClient.get("/api/bad")).rejects.toThrow("Fallback error");
    vi.unstubAllGlobals();
  });

  it("turns fetch failures into a user-readable network message", async () => {
    vi.stubGlobal("fetch", () => Promise.reject(new TypeError("Failed to fetch")));

    await expect(httpClient.get("/api/private")).rejects.toThrow(
      "Network request failed. Check that the Memora backend is reachable."
    );

    vi.unstubAllGlobals();
  });
});
