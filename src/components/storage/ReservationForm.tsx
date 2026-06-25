"use client";

/**
 * Reservation form (client component).
 *
 * The mandatory-fields rule is structural: firstName, lastName, email are
 * always rendered as visible required inputs. NEVER hide them, default them,
 * or auto-fill them — the upstream vendor 400s without them and synthetic
 * values corrupt the lead record for downstream lease-prep flows. See
 * `monument-reservation/references/mandatory-fields.md` for the full rationale.
 *
 * Validation rules enforced before submit:
 *   - phone: digits-only (strip parens/dashes/spaces)
 *   - state: US 2-letter or CA province, uppercase
 *   - country: "US" | "CA"
 *   - zip: US 5/9-digit or CA "A1A 1A1"
 *   - dateDesiredMoveIn: ISO-8601 UTC Z-suffixed
 *
 * `omit_unset_optionals`: optional fields the user leaves blank are dropped
 * from the body entirely — never sent as "" or null.
 */

import { useState } from "react";
import type { ReservationRequest } from "@/types/Reservation";
import { postReservation, ReservationValidationError } from "@/lib/api/postReservation";

interface ReservationFormProps {
  facilityUuid: string;
  unitGroupUuid: string;
}

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: string;
  country: "" | "US" | "CA";
  zip: string;
  dateDesiredMoveIn: string;
  isSmsEnrolled: boolean;
}

const initialState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  state: "",
  country: "",
  zip: "",
  dateDesiredMoveIn: "",
  isSmsEnrolled: false,
};

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; leadUuid: string; verifyToken: string }
  | { kind: "error"; message: string };

const stripDigits = (s: string) => s.replace(/\D+/g, "");
const STATE_RE = /^[A-Z]{2}$/;
const ZIP_RE = /^(?:\d{5}(?:-\d{4})?|[A-Z]\d[A-Z] \d[A-Z]\d)$/;

export function ReservationForm({ facilityUuid, unitGroupUuid }: ReservationFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ kind: "submitting" });

    // Validate optional fields the user filled in.
    if (form.state && !STATE_RE.test(form.state.trim().toUpperCase())) {
      setStatus({ kind: "error", message: "State must be a 2-letter US or CA code (e.g. TX, ON)." });
      return;
    }
    if (form.zip && !ZIP_RE.test(form.zip.trim().toUpperCase())) {
      setStatus({ kind: "error", message: "Zip must be a US 5/9-digit code or CA postal code." });
      return;
    }

    // Build the body conditionally — omit unset optionals.
    const phoneDigits = form.phone ? stripDigits(form.phone) : "";
    const body: ReservationRequest = {
      facilityUuid,
      unitGroupUuid,
      person: {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        ...(phoneDigits && { phone: phoneDigits }),
        ...(form.state && { state: form.state.trim().toUpperCase() }),
        ...(form.country && { country: form.country }),
        ...(form.zip && { zip: form.zip.trim().toUpperCase() }),
        ...(form.isSmsEnrolled && { isSmsEnrolled: true }),
      },
      ...(form.dateDesiredMoveIn && { dateDesiredMoveIn: form.dateDesiredMoveIn }),
      leadStatus: "RESERVED",
    };

    try {
      const result = await postReservation(body);
      setStatus({
        kind: "success",
        leadUuid: result.data.leadUuid,
        verifyToken: result.data.verifyToken,
      });
    } catch (err) {
      const message =
        err instanceof ReservationValidationError
          ? err.body || err.message
          : err instanceof Error
            ? err.message
            : "Reservation failed. Please try again.";
      setStatus({ kind: "error", message });
    }
  };

  if (status.kind === "success") {
    return (
      <div data-nocms-component="reservation-form" role="status" aria-live="polite" className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="text-xl font-semibold text-emerald-900" data-role="heading">Reservation confirmed</h2>
        <p className="mt-2 text-sm text-emerald-800">
          We&apos;ve held your unit. We&apos;ve also emailed you a confirmation; bring it on move-in day.
        </p>
        <p className="mt-3 text-xs text-emerald-700">
          Reference ID: <code className="font-mono">{status.leadUuid}</code>
        </p>
      </div>
    );
  }

  const submitting = status.kind === "submitting";

  return (
    <form data-nocms-component="reservation-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
      <fieldset disabled={submitting} className="space-y-4">
        <legend className="text-base font-semibold">Your details</legend>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium">
              First name <span aria-hidden="true">*</span>
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              required
              maxLength={128}
              value={form.firstName}
              onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:outline-none"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium">
              Last name <span aria-hidden="true">*</span>
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              required
              maxLength={128}
              value={form.lastName}
              onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:outline-none"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="state" className="block text-sm font-medium">State</label>
            <input
              id="state"
              name="state"
              type="text"
              autoComplete="address-level1"
              maxLength={2}
              value={form.state}
              onChange={(e) => setForm((f) => ({ ...f, state: e.target.value.toUpperCase() }))}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 uppercase focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:outline-none"
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium">Country</label>
            <select
              id="country"
              name="country"
              autoComplete="country"
              value={form.country}
              onChange={(e) => setForm((f) => ({ ...f, country: e.target.value as FormState["country"] }))}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:outline-none"
            >
              <option value="">—</option>
              <option value="US">US</option>
              <option value="CA">CA</option>
            </select>
          </div>
          <div>
            <label htmlFor="zip" className="block text-sm font-medium">Zip / Postal</label>
            <input
              id="zip"
              name="zip"
              type="text"
              autoComplete="postal-code"
              value={form.zip}
              onChange={(e) => setForm((f) => ({ ...f, zip: e.target.value }))}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="dateDesiredMoveIn" className="block text-sm font-medium">Desired move-in</label>
          <input
            id="dateDesiredMoveIn"
            name="dateDesiredMoveIn"
            type="date"
            value={form.dateDesiredMoveIn ? form.dateDesiredMoveIn.slice(0, 10) : ""}
            onChange={(e) => {
              const date = e.target.value;
              setForm((f) => ({
                ...f,
                dateDesiredMoveIn: date ? `${date}T00:00:00Z` : "",
              }));
            }}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:outline-none"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isSmsEnrolled}
            onChange={(e) => setForm((f) => ({ ...f, isSmsEnrolled: e.target.checked }))}
            className="h-4 w-4 rounded border-zinc-300 focus-visible:ring-2 focus-visible:ring-zinc-900"
          />
          <span>Text me move-in reminders</span>
        </label>
      </fieldset>

      {status.kind === "error" && (
        <p role="alert" aria-live="assertive" className="text-sm text-red-700">
          {status.message}
        </p>
      )}

      <button
        type="submit"
        data-role="submit"
        disabled={submitting}
        className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:outline-none"
      >
        {submitting ? "Reserving…" : "Reserve unit"}
      </button>
    </form>
  );
}
