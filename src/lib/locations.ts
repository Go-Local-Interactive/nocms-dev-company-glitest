import type { PayloadLocation } from "@/lib/payload";
import type { FacilityIndexEntry } from "@/types/Facility";
import type { CardFacility } from "@/components/facility/FacilityCard";

/**
 * Slug helpers for the `locations` collection. On imported sites, location
 * slugs are FULL legacy URL paths (`texas`, `texas/dallas`,
 * `texas/dallas/main-st-storage`), so hierarchy is derived purely from
 * slug-prefix matching — no parent pointers needed. Used by the root
 * catch-all route, the state/city hub components, and every page that links
 * a location — `locationHref` is the canonical URL builder template-wide.
 */

/** Last path segment of a (possibly nested) slug. */
export const leaf = (slug: string): string => slug.split("/").pop() ?? slug;

/** URL of a populated media relationship (`{ url }`), else undefined. A bare
 *  id string (unpopulated) or null yields undefined. */
function mediaUrl(m: unknown): string | undefined {
  return m && typeof m === "object" && typeof (m as { url?: unknown }).url === "string"
    ? (m as { url: string }).url
    : undefined;
}

/**
 * Card thumbnail URL for a location — the FIRST image of the imported facility
 * gallery, mirroring legacy `getFirstGalleryImage(facility.gallery)`. Prefers
 * `featuredImage` (the migration sets it to `gallery[0]`) but falls back to the
 * first populated `gallery` item, since `featuredImage` isn't always set even
 * when the gallery is. Returns `undefined` when there's no image — callers then
 * fall back to the card's no-photo placeholder.
 */
export function cardImageUrl(loc: PayloadLocation): string | undefined {
  return mediaUrl(loc.featuredImage) ?? (loc.gallery ?? []).map(mediaUrl).find(Boolean);
}

/** Flat key the static FMS loader joins on — slugs are nested legacy paths. */
export const fmsJoinKey = (loc: PayloadLocation): string => loc.fmsKey ?? leaf(loc.slug);

/** Canonical href for a location — every doc lives at its full legacy path. */
export const locationHref = (loc: { slug: string }): string => `/${loc.slug}`;

/** Direct children: exactly one path segment below the hub's slug. */
export function directChildren(
  hub: PayloadLocation,
  all: PayloadLocation[],
): PayloadLocation[] {
  const prefix = `${hub.slug}/`;
  const depth = hub.slug.split("/").length + 1;
  return all.filter(
    (l) => l.slug.startsWith(prefix) && l.slug.split("/").length === depth,
  );
}

/** Every `single` location anywhere under the hub (any depth). */
export function descendantSingles(
  hub: PayloadLocation,
  all: PayloadLocation[],
): PayloadLocation[] {
  const prefix = `${hub.slug}/`;
  return all.filter((l) => l.locationType === "single" && l.slug.startsWith(prefix));
}

/** "main-st-storage" → "Main St Storage" — fallback when an ancestor slug has no doc. */
const humanizeSegment = (segment: string): string =>
  segment.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * Breadcrumb items for a location's ancestors (slug prefixes, nearest last;
 * the location itself is excluded). Titles come from the fetched location
 * list — e.g. for city `texas/dallas`, ancestor `texas` resolves to that
 * doc's title — falling back to a humanized segment when no doc exists.
 *
 * When `indexSlug` is given, the ancestor segment whose full slug equals it is
 * SKIPPED: the all-locations landing is a `pages` doc (not in `all`) and is
 * rendered separately as the explicit linked root crumb, so emitting it here
 * would only produce an unlinked duplicate. Intermediate state/city ancestors
 * ARE locations and still resolve to their `/{slug}` pages.
 */
export function ancestorCrumbs(
  loc: PayloadLocation,
  all: PayloadLocation[],
  indexSlug?: string,
): { label: string; href?: string }[] {
  const segments = loc.slug.split("/");
  const bySlug = new Map(all.map((l) => [l.slug, l]));
  return segments
    .slice(0, -1)
    .map((segment, i) => {
      const slug = segments.slice(0, i + 1).join("/");
      const doc = bySlug.get(slug);
      return {
        slug,
        label: doc?.title ?? humanizeSegment(segment),
        // No doc means no page is exported at /{slug} — leave the crumb
        // unlinked (Breadcrumbs renders it as a plain span) instead of 404ing.
        href: doc ? `/${slug}` : undefined,
      };
    })
    .filter((crumb) => crumb.slug !== indexSlug)
    .map(({ slug: _slug, ...crumb }) => crumb);
}

/**
 * Build a FacilityCard-compatible record for a `single` location. FMS-matched
 * facilities carry operational data (the editorial title wins when set);
 * content-only locations render an editorial card from Payload fields. The
 * card's `slug` is always the location's nested slug so `hrefFor`/keys point
 * at the legacy-parity URL, not the flat FMS slug.
 */
export function toCardFacility(
  single: PayloadLocation,
  fms: FacilityIndexEntry | undefined,
): CardFacility {
  if (fms) return { ...fms, slug: single.slug, name: single.title || fms.name };
  return {
    slug: single.slug,
    name: single.title,
    address: {
      line1: single.address?.street ?? "",
      line2: single.address?.unit ?? null,
      city: single.city ?? "",
      state: single.state ?? "",
      zip: single.address?.postalCode ?? "",
    },
    phone: single.address?.phone ?? null,
    city: single.city ?? "",
    state: single.state ?? "",
  };
}

/**
 * Cards for every `single` location that has FMS operational data. FMS index
 * slugs are FLAT keys while location slugs are full legacy paths — join on
 * `fmsJoinKey`; `toCardFacility` keeps the nested slug so each card links the
 * legacy-parity `/{slug}` URL. Content-only locations are skipped: callers
 * (rent-online, reserve-online, the storage-locations index) list facilities
 * to transact on, and there is nothing to rent or reserve without FMS data.
 */
export function fmsBackedCardFacilities(
  locations: PayloadLocation[],
  fms: FacilityIndexEntry[],
): CardFacility[] {
  const fmsByKey = new Map(fms.map((f) => [f.slug, f]));
  return locations
    .filter((l) => l.locationType === "single")
    .flatMap((l) => {
      const entry = fmsByKey.get(fmsJoinKey(l));
      return entry ? [toCardFacility(l, entry)] : [];
    });
}
