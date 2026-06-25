import type { PayloadPage, PayloadAtomicBlock } from "@/lib/payload";
import type { BreadcrumbItem } from "@/components/layout/Breadcrumbs";

// Blocks that are their own full-bleed page header — when a page leads with one,
// suppress the separate title/breadcrumb + the pre-footer CTA (mirrors legacy:
// home leads with its hero). Only `hero` qualifies: a `media-overlay` is a
// generic content banner that can lead a page without being its header, so it
// must NOT suppress the page chrome.
const LEAD_BLOCKS = new Set(["hero"]);

export function pageLeadsWithHero(page: Pick<PayloadPage, "slug" | "blocks">): boolean {
  if (page.slug === "home" || page.slug === "") return true;
  const first = (page.blocks ?? [])[0] as PayloadAtomicBlock | undefined;
  return !!first && LEAD_BLOCKS.has(first.blockType);
}

const humanize = (s: string) =>
  s.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/** Trail `…intermediate… › Title` from the page's (possibly nested) slug, for
 *  `<Breadcrumbs items={...} />`. The "Home" crumb is prepended by Breadcrumbs
 *  itself, so it's omitted here. Intermediate segments link to `/segment-path`;
 *  the last crumb is the page title (unlinked, per `BreadcrumbItem`). */
export function pageCrumbs(page: Pick<PayloadPage, "slug" | "title">): BreadcrumbItem[] {
  const segs = (page.slug ?? "").split("/").filter(Boolean);
  const crumbs: BreadcrumbItem[] = segs.slice(0, -1).map((seg, i) => ({
    label: humanize(seg),
    href: "/" + segs.slice(0, i + 1).join("/"),
  }));
  crumbs.push({ label: page.title });
  return crumbs;
}
