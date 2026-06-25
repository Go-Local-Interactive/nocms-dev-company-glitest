/**
 * Two-step JWT auth against the nocms backend (FMS-agnostic).
 *
 * Mirrors storage-theme-payload's `getSeAuth` pattern:
 *   - module-level token cache
 *   - in-flight login dedupe (concurrent callers share one promise)
 *   - rate-limited login call (login counts against the same per-minute cap)
 *
 * The public NEXT_PUBLIC_API_KEY is exchanged at /api/v3/login for a JWT.
 * That JWT is then attached as Bearer on every data call. The raw API key
 * is NEVER sent on a data endpoint — the backend rejects that with 401.
 *
 * Cache TTL is conservative (30 min) with a 60 s refresh buffer. Vendors
 * issue longer-lived JWTs but we'd rather log in fresh than chase expiry.
 */

import { getApiServer } from "./getApiServer";
import { apiRateLimiter } from "./apiRateLimiter";

const TOKEN_TTL_MS = 30 * 60 * 1000;
const TOKEN_REFRESH_BUFFER_MS = 60 * 1000;

let cachedToken: { value: string; expiresAt: number } | null = null;
let inFlightLogin: Promise<string> | null = null;

export async function getApiToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + TOKEN_REFRESH_BUFFER_MS) {
    return cachedToken.value;
  }
  if (inFlightLogin) return inFlightLogin;

  inFlightLogin = (async () => {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (!apiKey) {
      throw new Error("NEXT_PUBLIC_API_KEY is not set. Add it to .env.local.");
    }

    await apiRateLimiter.waitForSlot();

    const res = await fetch(`${getApiServer()}/api/v3/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ api_key: apiKey }),
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Login failed: ${res.status} ${res.statusText} — ${body.slice(0, 200)}`);
    }

    const json = (await res.json()) as { token?: string; access_token?: string; data?: { token?: string }; jwt?: string };
    const token = json.token ?? json.access_token ?? json.data?.token ?? json.jwt;
    if (!token) {
      throw new Error("Login returned no token");
    }
    cachedToken = { value: token, expiresAt: Date.now() + TOKEN_TTL_MS };
    return token;
  })();

  try {
    return await inFlightLogin;
  } finally {
    inFlightLogin = null;
  }
}

/** Force a fresh login on the next call. Use after a 401 from a data endpoint. */
export function invalidateApiToken(): void {
  cachedToken = null;
}
