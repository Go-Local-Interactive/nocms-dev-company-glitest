/**
 * Submit a soft reservation (lead) to the nocms backend.
 *
 * POST /api/v3/reservation. The proxy resolves the active FMS adapter from
 * the facilityUuid in the body and delegates to the vendor; the template
 * stays vendor-neutral.
 *
 * Returns { leadUuid, verifyToken } — the caller MUST persist both;
 * downstream flows (lease prep, conversion) require them. POSTs are NOT
 * idempotent; do not silently retry on 5xx — surface to the user.
 *
 * Build the body conditionally — never send empty strings or null for unfilled
 * optional fields. See `omit_unset_optionals` in the monument-reservation skill.
 */

import { apiFetch } from "./apiFetch";
import type { ReservationRequest, ReservationResponse } from "../../types/Reservation";

export class ReservationValidationError extends Error {
  constructor(public readonly status: number, public readonly body: string) {
    super(`Reservation validation failed (${status}): ${body.slice(0, 300)}`);
    this.name = "ReservationValidationError";
  }
}

export async function postReservation(body: ReservationRequest): Promise<ReservationResponse> {
  const res = await apiFetch(`/api/v3/reservation`, {
    method: "POST",
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (res.status === 400) {
    const text = await res.text().catch(() => "");
    throw new ReservationValidationError(400, text);
  }
  if (res.status === 403) {
    throw new Error(`reservation: no FMS key on this project owns facility ${body.facilityUuid} (403)`);
  }
  if (!res.ok) {
    throw new Error(`reservation submit failed: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as ReservationResponse;
  if (!json.data?.leadUuid || !json.data?.verifyToken) {
    throw new Error("reservation: response missing leadUuid or verifyToken");
  }
  return json;
}
