/**
 * Authenticated fetch against the nocms backend (FMS-agnostic).
 *
 * Composes:
 *   1. JWT acquisition (cached, deduped) via getApiToken
 *   2. Rate-limit slot via apiRateLimiter
 *   3. Single 401 retry — if the cached JWT was rejected, invalidate and re-login
 *
 * Pass relative paths starting with `/api/v3/...`; absolute URLs are used as-is.
 * `body` is JSON-stringified by the caller — pass an already-stringified body.
 */

import { getApiServer } from "./getApiServer";
import { getApiToken, invalidateApiToken } from "./getApiToken";
import { apiRateLimiter } from "./apiRateLimiter";

export type ApiFetchInit = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
  /** Next.js fetch extensions (revalidate, tags). */
  next?: { revalidate?: number | false; tags?: string[] };
};

export async function apiFetch(path: string, init: ApiFetchInit = {}): Promise<Response> {
  const url = path.startsWith("http")
    ? path
    : `${getApiServer()}${path.startsWith("/") ? "" : "/"}${path}`;

  const attempt = async (token: string): Promise<Response> => {
    await apiRateLimiter.waitForSlot();
    return fetch(url, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...init.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  };

  let token = await getApiToken();
  let res = await attempt(token);
  if (res.status === 401) {
    invalidateApiToken();
    token = await getApiToken();
    res = await attempt(token);
  }
  return res;
}
