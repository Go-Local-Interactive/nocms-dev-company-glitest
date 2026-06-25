/**
 * Normalized reservation shapes — what the v3 nocms proxy accepts at
 * POST /api/v3/{fms}/reservation and what it returns on success.
 *
 * The mandatory-fields rule (facilityUuid, unitGroupUuid, person.firstName/
 * lastName/email, leadStatus="RESERVED") is enforced at the form layer — the
 * upstream vendor 400s without them and synthetic placeholders corrupt the
 * lead record for downstream lease prep.
 *
 * `omit_unset_optionals`: never send empty strings, null, or placeholders for
 * unfilled optional fields. Build the body conditionally.
 */

export type LeadStatus = "OPEN" | "RESERVED" | "LOST";
export type LeadType = "All" | "Personal" | "Business";
export type CountryCode = "US" | "CA";

export interface ReservationPerson {
  /** REQUIRED. Max 128. */
  firstName: string;
  /** REQUIRED. Max 128. */
  lastName: string;
  /** REQUIRED. RFC 5322 email. */
  email: string;
  /** Digits only — strip parens/dashes/spaces client-side before submit. */
  phone?: string;
  /** Vendor-specific enum, e.g. "MOBILE". */
  phoneType?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  /** US 2-letter or CA province code, uppercase. */
  state?: string;
  country?: CountryCode;
  /** US 5/9-digit or CA "A1A 1A1" (with the space). */
  zip?: string;
  /** Treated as false when missing. */
  isSmsEnrolled?: boolean;
}

/**
 * Reservation request body. Build conditionally — never send empty strings,
 * null, or placeholders for unfilled optional fields.
 */
export interface ReservationRequest {
  /** REQUIRED. From the facility's static data. */
  facilityUuid: string;
  /** REQUIRED. From the unit-group card the user picked. */
  unitGroupUuid: string;
  /** REQUIRED. Mandatory subfields: firstName, lastName, email. */
  person: ReservationPerson;
  /** ISO-8601 UTC, Z-suffixed. Optional. */
  dateDesiredMoveIn?: string;
  /** REQUIRED. Must be "RESERVED" for soft-reservation flow. */
  leadStatus: LeadStatus;
  /** Case-sensitive. Backend rejects uppercase variants. */
  leadType?: LeadType;
  businessName?: string;
  taxId?: string;
}

export interface ReservationResponse {
  data: {
    /** Persist this — required for every downstream call (lease prep, conversion). */
    leadUuid: string;
    /** Persist alongside leadUuid; required for authenticated lead reads. */
    verifyToken: string;
  };
}
