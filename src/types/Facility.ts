/**
 * The normalized Facility type the entire template consumes.
 *
 * The agent's `fetchXFacilities` MCP tools (one per supported FMS) inline
 * records of this shape into `src/lib/facilities/data/{slug}.json` at scaffold
 * time. Pages read from those files via `loader.ts`. NEVER fetch this shape
 * at runtime inside a generated site — the static data is the source of truth.
 *
 * The shape is FMS-agnostic. Per-vendor differences are normalized away by the
 * v3 nocms proxy. Each facility carries an `fms` field so multi-FMS sites can
 * route runtime calls (unit-groups, reservation) to the right vendor adapter.
 */

export type SupportedFms = "monument" | "storedge" | "sitelink";

export type FacilityHourEntry = {
  day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  isOpen: boolean;
  openTime: string | null;
  closeTime: string | null;
};

export interface Facility {
  /** URL segment; unique across this site */
  slug: string;
  /** FMS-native identifier — handed to unit-groups / reservation endpoints */
  id: string;
  /** Which FMS owns this facility. Determines the runtime endpoint path. */
  fms: SupportedFms;
  /** Display title */
  name: string;
  address: {
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    zip: string;
  };
  /** Customer-facing phone; consumer renders as `tel:` */
  phone: string | null;
  /** Customer-facing email (omit operations mailboxes) */
  email: string | null;
  /** Null when the FMS didn't supply usable coords */
  coords: { lat: number; lng: number } | null;
  /** IANA tz name (e.g. "America/New_York") */
  timeZone: string | null;
  /** Always 7 entries, ordered monday → sunday */
  hours: FacilityHourEntry[];
  amenities: string[];
  unitTypes: string[];
}

/** Slim record written to data/index.json — used by listFacilities() */
export interface FacilityIndexEntry {
  slug: string;
  id: string;
  fms: SupportedFms;
  name: string;
  city: string;
  state: string;
}
