import { fetchPosts, fetchAllLocations } from "@/lib/payload";
import { listFacilities } from "@/lib/facilities/loader";
import { fmsJoinKey, locationHref } from "@/lib/locations";
import { SiteSearchClient, type SearchableItem } from "./SearchClient";

export default async function SiteSearchPage() {
  const [posts, locations, facilities] = await Promise.all([
    fetchPosts(200),
    fetchAllLocations(),
    listFacilities(),
  ]);

  // Storage-locations: Payload single-type docs, joined to FMS for city/state.
  // FMS index slugs are flat keys; location slugs are full legacy paths.
  const fmsByKey = new Map(facilities.map((f) => [f.slug, f]));
  const facilityItems: SearchableItem[] = locations
    .filter((loc) => loc.locationType === "single")
    .map((loc) => {
      const fms = fmsByKey.get(fmsJoinKey(loc));
      const city = fms?.city ?? loc.city ?? "";
      const state = fms?.state ?? loc.state ?? "";
      return {
        kind: "facility" as const,
        title: loc.title || fms?.name || loc.slug,
        href: locationHref(loc),
        description: [city, state].filter(Boolean).join(", "),
        haystack: `${loc.title} ${city} ${state}`.toLowerCase(),
      };
    });

  const postItems: SearchableItem[] = posts.map((p) => ({
    kind: "post",
    title: p.title,
    href: `/blog/${p.slug}`,
    description: p.excerpt ?? "",
    haystack: `${p.title} ${p.excerpt ?? ""}`.toLowerCase(),
  }));

  return <SiteSearchClient items={[...facilityItems, ...postItems]} />;
}
