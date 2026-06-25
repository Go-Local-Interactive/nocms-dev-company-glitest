import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  fetchAllPages,
  fetchPageBySlug,
  fetchAllLocations,
  fetchLocationBySlug,
  fetchLocationsIndexSlug,
  type PayloadLocation,
  type PayloadPage,
} from "@/lib/payload";
import { getFacility } from "@/lib/facilities/loader";
import { fmsJoinKey } from "@/lib/locations";
import { PageDocument, pageDocumentMetadata } from "@/components/blocks/PageDocument";
import { AllLocationsIndex } from "@/components/locations/AllLocationsIndex";
import { FacilityDetail } from "@/components/facility/FacilityDetail";
import { StateHub } from "@/components/locations/StateHub";
import { CityHub } from "@/components/locations/CityHub";
import { UnitGroupsView } from "@/components/facility/UnitGroupsView";
import { ReserveView, ReservePlaceholder } from "@/components/facility/ReserveView";

/**
 * Root catch-all serving imported legacy URLs. Document slugs in Payload are
 * FULL legacy paths (may contain `/`, e.g. page `about-us/team`, locations
 * `texas` / `texas/dallas` / `texas/dallas/main-st-storage`), so every path
 * resolves here, mirroring the legacy frontend's `[...slug]` route:
 *
 *   1. pages by full path
 *   2. locations by full path (single → facility detail, city/state → hubs)
 *   3. trailing transactional segments (`…/unit-groups`, `…/reserve/{uuid}`)
 *      resolved against the preceding path as a single location
 *   4. notFound()
 *
 * Static routes (about, blog, …) win by Next's routing precedence; we just
 * keep colliding first segments out of generateStaticParams. The content
 * stubs (about, contact, pricing, resources) check Payload themselves and
 * render an imported page at their exact slug, so shadowing never hides a
 * tenant page.
 */

type Params = { slug: string[] };
type Props = { params: Promise<Params> };

// Static routes always win — Next routes them before the catch-all. We still
// keep colliding paths out of generateStaticParams so the build doesn't try
// to render duplicates; see `isShadowed` for exactly which paths collide.
const RESERVED_FIRST_SEGMENTS = new Set([
  "about",
  "blog",
  "contact",
  "pay-online",
  "pricing",
  "rent-online",
  "reserve-online",
  "resources",
  "search",
]);

type Resolved =
  | { kind: "page"; page: PayloadPage }
  | { kind: "location"; location: PayloadLocation }
  | { kind: "unit-groups"; location: PayloadLocation }
  | { kind: "reserve"; location: PayloadLocation; unitGroupUuid: string };

async function resolvePath(segments: string[]): Promise<Resolved | null> {
  const path = segments.join("/");

  const page = await fetchPageBySlug(path);
  if (page) return { kind: "page", page };

  const location = await fetchLocationBySlug(path);
  if (location) return { kind: "location", location };

  const last = segments[segments.length - 1];
  if (segments.length >= 2 && last === "unit-groups") {
    const loc = await fetchLocationBySlug(segments.slice(0, -1).join("/"));
    if (loc?.locationType === "single") return { kind: "unit-groups", location: loc };
  }
  if (segments.length >= 3 && segments[segments.length - 2] === "reserve") {
    const loc = await fetchLocationBySlug(segments.slice(0, -2).join("/"));
    if (loc?.locationType === "single") {
      return { kind: "reserve", location: loc, unitGroupUuid: last };
    }
  }
  return null;
}

/**
 * Is this path shadowed by a static route, i.e. unreachable through the
 * catch-all? Two distinct cases:
 *
 * - Leaf stubs (about, contact, pricing, resources): a single page.tsx with
 *   no subtree. Only the EXACT single-segment path collides; nested imported
 *   pages like `about/team` still resolve via the catch-all and must be
 *   enumerated, or `output: "export"` builds them as 404s. The four content
 *   stubs render a tenant Payload page at their slug themselves (see their
 *   page.tsx), so the collision is harmless there too.
 * - Subtree roots (`blog`): own dynamic `[slug]` subtrees, so every path
 *   under them is handled there — skip the whole prefix.
 *
 * `storage-locations` is intentionally NOT shadowed: the hardcoded index route
 * was removed, so the catch-all both serves and enumerates a landing page
 * slugged `storage-locations` and any `/storage-locations/...` imported paths.
 */
const isShadowed = (segments: string[]) =>
  (segments.length === 1 && RESERVED_FIRST_SEGMENTS.has(segments[0]!)) ||
  segments[0] === "blog";

export async function generateStaticParams(): Promise<Params[]> {
  const [pages, locations] = await Promise.all([fetchAllPages(), fetchAllLocations()]);
  const params: Params[] = [];

  for (const page of pages) {
    if (!page.slug || page.slug === "home") continue;
    const segments = page.slug.split("/");
    if (isShadowed(segments)) continue;
    params.push({ slug: segments });
  }

  for (const loc of locations) {
    if (!loc.slug) continue;
    const segments = loc.slug.split("/");
    if (isShadowed(segments)) continue;
    params.push({ slug: segments });
    if (loc.locationType === "single") {
      params.push({ slug: [...segments, "unit-groups"] });
      // Real unit-group uuids aren't enumerable at build time yet (see the
      // reserve route) — emit the per-facility placeholder route instead.
      params.push({ slug: [...segments, "reserve", "_placeholder"] });
    }
  }

  if (params.length === 0) return [{ slug: ["_placeholder"] }];
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug[0] === "_placeholder") return { title: "Page" };

  const resolved = await resolvePath(slug);
  if (!resolved) return { title: "Page not found" };

  switch (resolved.kind) {
    case "page":
      return pageDocumentMetadata(resolved.page);
    case "location": {
      const editorial = resolved.location;
      if (editorial.locationType !== "single") {
        return {
          title: editorial.meta?.title ?? editorial.title,
          description: editorial.meta?.description,
        };
      }
      const facility = await getFacility(fmsJoinKey(editorial));
      const name = editorial.title ?? facility?.name ?? "Location";
      const city = facility?.address.city ?? editorial.city ?? "";
      const state = facility?.address.state ?? editorial.state ?? "";
      return {
        title: editorial.meta?.title ?? `${name} — ${city}, ${state}`,
        description:
          editorial.meta?.description ??
          (facility
            ? `Self-storage at ${facility.address.line1}, ${facility.address.city}.${facility.phone ? ` Call ${facility.phone}.` : ""}`
            : undefined),
      };
    }
    case "unit-groups": {
      const facility = await getFacility(fmsJoinKey(resolved.location));
      if (!facility) return { title: "Sizes not found" };
      return {
        title: `Available sizes — ${facility.name}`,
        description: `Reserve a storage unit at ${facility.name} in ${facility.address.city}, ${facility.address.state}.`,
      };
    }
    case "reserve": {
      const facility = await getFacility(fmsJoinKey(resolved.location));
      if (!facility) return { title: "Reserve" };
      return {
        title: `Reserve at ${facility.name}`,
        description: `Reserve your storage unit at ${facility.name} in ${facility.address.city}, ${facility.address.state}.`,
        robots: { index: false, follow: true },
      };
    }
  }
}

export default async function CatchAllPage({ params }: Props) {
  const { slug } = await params;
  if (slug[0] === "_placeholder") {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Page</h1>
        <p className="mt-4 text-zinc-600">Create a page in the CMS to publish it here.</p>
      </main>
    );
  }

  const resolved = await resolvePath(slug);
  if (!resolved) notFound();

  // Fetched once per request and threaded into every breadcrumbed render
  // branch: the breadcrumb root crumb must link the tenant's real
  // all-locations index slug, not a hardcoded path.
  const indexSlug = await fetchLocationsIndexSlug();

  switch (resolved.kind) {
    case "page": {
      // The migrated all-locations landing renders its editorial blocks PLUS
      // the full facility listing; the catch-all owns this composition so the
      // page itself stays a plain document. A normal page renders blocks only.
      if (indexSlug && resolved.page.slug === indexSlug) {
        const allLocations = await fetchAllLocations();
        return (
          <>
            <PageDocument page={resolved.page} />
            <AllLocationsIndex allLocations={allLocations} />
          </>
        );
      }
      return <PageDocument page={resolved.page} />;
    }
    case "location": {
      const loc = resolved.location;
      if (loc.locationType === "single") {
        const facility = await getFacility(fmsJoinKey(loc));
        return (
          <FacilityDetail
            editorial={loc}
            facility={facility}
            unitGroupsHref={`/${loc.slug}/unit-groups`}
            locationsIndexSlug={indexSlug ?? undefined}
          />
        );
      }
      // Hubs derive children + breadcrumb ancestor titles from the full list.
      const allLocations = await fetchAllLocations();
      return loc.locationType === "state" ? (
        <StateHub
          location={loc}
          allLocations={allLocations}
          locationsIndexSlug={indexSlug ?? undefined}
        />
      ) : (
        <CityHub
          location={loc}
          allLocations={allLocations}
          locationsIndexSlug={indexSlug ?? undefined}
        />
      );
    }
    case "unit-groups": {
      const facility = await getFacility(fmsJoinKey(resolved.location));
      if (!facility) notFound();
      return (
        <UnitGroupsView
          facility={facility}
          locationSlug={resolved.location.slug}
          locationsIndexSlug={indexSlug ?? undefined}
        />
      );
    }
    case "reserve": {
      // Build-time placeholder param renders before the FMS join so content-only
      // locations still export a page instead of a 404 (matches the old route).
      if (resolved.unitGroupUuid === "_placeholder") return <ReservePlaceholder />;
      const facility = await getFacility(fmsJoinKey(resolved.location));
      if (!facility) notFound();
      return (
        <ReserveView
          facility={facility}
          locationSlug={resolved.location.slug}
          unitGroupUuid={resolved.unitGroupUuid}
          locationsIndexSlug={indexSlug ?? undefined}
        />
      );
    }
  }
}
