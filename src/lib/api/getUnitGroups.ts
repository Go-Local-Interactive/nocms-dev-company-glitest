/**
 * Fetch the unit-groups list for a single facility.
 *
 * Hits GET /api/v3/unit-groups?facilityUuid={facilityUuid} on the nocms
 * backend. The proxy resolves the active FMS adapter from the facility UUID,
 * fetches from the vendor, and normalizes the response to the common UnitGroup
 * contract — the template stays vendor-neutral.
 *
 * `revalidate: 60` — availability data doesn't change every second; a one-minute
 * static cache is sensible. Pass `cache: "no-store"` (via override) for live
 * filter toggles or admin-tools where freshness matters.
 */

import { apiFetch } from "./apiFetch";
import type { UnitGroup, UnitGroupsResponse } from "../../types/UnitGroup";

export interface GetUnitGroupsOptions {
  /** Per-fetch cache override. Defaults to `next.revalidate = 60`. */
  cache?: RequestCache;
  /** Override the default 60s revalidation window. */
  revalidate?: number;
}

export async function getUnitGroups(
  facilityUuid: string,
  options: GetUnitGroupsOptions = {},
): Promise<UnitGroup[]> {
  const { cache, revalidate = 60 } = options;
  const path = `/api/v3/unit-groups?facilityUuid=${encodeURIComponent(facilityUuid)}`;

  const res = await apiFetch(path, {
    method: "GET",
    ...(cache ? { cache } : { next: { revalidate } }),
  });

  if (res.status === 403) {
    throw new Error(`unit-groups: no FMS key on this project owns facility ${facilityUuid} (403)`);
  }
  if (res.status === 404) {
    throw new Error(`unit-groups: facility ${facilityUuid} not found (404)`);
  }
  if (!res.ok) {
    throw new Error(`unit-groups fetch failed: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as UnitGroupsResponse;
  if (!json.data?.unitGroups) {
    throw new Error("unit-groups: unexpected response shape (data.unitGroups missing)");
  }
  return json.data.unitGroups;
}
