import type { MetadataRoute } from "next";
import { fetchPosts, fetchAllPages, fetchAllLocations } from "@/lib/payload";
import { locationHref } from "@/lib/locations";

export const dynamic = "force-static";

const BASE_URL = process.env.SITE_URL ?? "https://example.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Paginated helpers — a capped fetch silently drops URLs once the
  // collections outgrow the cap (same truncation issue as static params).
  const [posts, pages, locations] = await Promise.all([
    fetchPosts(500),
    fetchAllPages(),
    fetchAllLocations(),
  ]);

  // The all-locations landing is a `pages` doc covered by `pagePaths` below
  // (at the tenant's real index slug); a hardcoded `/storage-locations` is a
  // dead URL for imports whose index slug differs, so it's intentionally omitted.
  const staticPages = [
    "",
    "/about",
    "/contact",
    "/pricing",
    "/resources",
    "/blog",
  ];
  const blogPages = posts.map((p) => `/blog/${p.slug}`);
  // Imported docs live at their full (possibly nested) legacy paths.
  const pagePaths = pages
    .filter((p) => p.slug && p.slug !== "home")
    .map((p) => `/${p.slug}`);
  // Every location — singles AND city/state hubs — renders a page at /{slug}.
  const locationPages = locations.filter((l) => l.slug).map(locationHref);

  const allPages = [
    ...new Set([...staticPages, ...blogPages, ...pagePaths, ...locationPages]),
  ];

  return allPages.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1.0 : path.split("/").length <= 2 ? 0.8 : 0.6,
  }));
}
