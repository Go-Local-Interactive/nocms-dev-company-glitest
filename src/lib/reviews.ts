/**
 * Server-side Google reviews fetch for the "What Our Customers Are Saying"
 * (testimonial / corporate-reviews) block. Ports legacy
 * `storage-theme-payload`'s CorporateReviews: pull Google reviews from up to 4
 * facilities, distribute a fixed per-facility quota, backfill with the newest
 * remaining, and cap at 4 cards.
 *
 * Uses the Places API (New) Place Details endpoint with a SERVER key — runs only
 * server-side (build/render), never in the browser. The new API returns
 * `relativePublishTimeDescription` ("3 weeks ago") directly, matching legacy.
 */

export interface GoogleReview {
  author: string;
  rating: number;
  text: string;
  /** e.g. "3 weeks ago" — Google's localized relative time. */
  relativeTime: string;
  /** ISO publish time, for newest-first ordering. */
  publishTime: string;
}

/** Legacy per-facility review quotas keyed by contributing-facility count. */
const QUOTAS_BY_COUNT: Record<number, number[]> = {
  1: [4],
  2: [2, 2],
  3: [2, 1, 1],
  4: [1, 1, 1, 1],
};
const MAX_REVIEWS = 4;

interface PlacesReview {
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  authorAttribution?: { displayName?: string };
  publishTime?: string;
  relativePublishTimeDescription?: string;
}

function sortNewestFirst(reviews: GoogleReview[]): GoogleReview[] {
  return [...reviews].sort((a, b) => {
    const ta = a.publishTime ? Date.parse(a.publishTime) : 0;
    const tb = b.publishTime ? Date.parse(b.publishTime) : 0;
    return tb - ta;
  });
}

/** Fetch up to 5 reviews for one place via the Places API (New). Returns [] on
 *  any error (missing place, bad key, API not enabled) so the section degrades
 *  gracefully rather than throwing. */
async function fetchPlaceReviews(placeId: string, serverKey: string): Promise<GoogleReview[]> {
  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        headers: {
          "X-Goog-Api-Key": serverKey,
          "X-Goog-FieldMask": "reviews",
        },
        // Cache at build / for a day in dev so reviews aren't re-fetched on
        // every preview reload (they change rarely; a re-deploy refreshes them).
        next: { revalidate: 86400 },
      },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { reviews?: PlacesReview[] };
    const reviews = Array.isArray(data.reviews) ? data.reviews : [];
    return reviews
      .map((r): GoogleReview => ({
        author: r.authorAttribution?.displayName?.trim() ?? "",
        rating: typeof r.rating === "number" ? r.rating : 0,
        text: (r.text?.text ?? r.originalText?.text ?? "").trim(),
        relativeTime: r.relativePublishTimeDescription ?? "",
        publishTime: r.publishTime ?? "",
      }))
      .filter((r) => r.text.length > 0);
  } catch {
    return [];
  }
}

/**
 * Collect up to 4 review cards across the given place IDs, using the legacy
 * distribution + newest-first backfill. Returns [] when there's no key, no place
 * IDs, or no reviews — the caller then renders nothing.
 */
export async function fetchGoogleReviews(
  placeIds: string[],
  serverKey: string | null,
): Promise<GoogleReview[]> {
  const ids = placeIds.filter((id) => id && id.trim().length > 0).slice(0, MAX_REVIEWS);
  if (!serverKey || ids.length === 0) return [];

  const perFacility = await Promise.all(ids.map((id) => fetchPlaceReviews(id, serverKey)));
  const quotas = QUOTAS_BY_COUNT[ids.length] ?? [MAX_REVIEWS];

  const picked: GoogleReview[] = [];
  perFacility.forEach((reviews, i) => {
    picked.push(...sortNewestFirst(reviews).slice(0, quotas[i] ?? 0));
  });

  if (picked.length < MAX_REVIEWS) {
    const pickedSet = new Set(picked);
    const remaining = sortNewestFirst(
      perFacility.flat().filter((r) => !pickedSet.has(r)),
    );
    picked.push(...remaining.slice(0, MAX_REVIEWS - picked.length));
  }

  return picked.slice(0, MAX_REVIEWS);
}
