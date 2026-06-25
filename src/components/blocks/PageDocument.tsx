import type { Metadata } from "next";
import type { PayloadPage } from "@/lib/payload";
import { RenderBlocks } from "@/components/blocks/RenderBlocks";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LocateNearestCta } from "@/components/layout/LocateNearestCta";
import { payloadFieldAttrs } from "@/lib/payload-attrs";
import skinConfig from "@/skin.config";
import { pageCrumbs, pageLeadsWithHero } from "./page-header";

/**
 * Renders a Payload `pages` document. Used by the root catch-all for imported
 * legacy URLs, and by the static content stubs (about, contact, pricing,
 * resources) when a tenant page with that exact slug exists — an imported
 * legacy page overrides the template's demo content at the same URL.
 */
export function PageDocument({
  page,
  locationsIndexSlug,
}: {
  page: PayloadPage;
  locationsIndexSlug?: string;
}) {
  const blocks = page.blocks ?? [];
  // Content pages render headless otherwise — blocks carry no page title/breadcrumb.
  // Skip when the page leads with its own full-bleed header (home/hero-led).
  const showHeader = blocks.length > 0 && !pageLeadsWithHero(page);
  // The all-locations index page itself goes through PageDocument (catch-all
  // renders it alongside AllLocationsIndex), so suppress the band there — else
  // the "View All Locations" CTA self-links to the page you're on. Normalize
  // slashes and fall back to the same default the CTA uses ("all-locations"),
  // so a trailing-slash or null index slug still matches the index page.
  const stripSlashes = (s?: string | null) => (s ?? "").replace(/^\/+|\/+$/g, "");
  const indexSlug = stripSlashes(locationsIndexSlug) || "all-locations";
  const isIndexPage = stripSlashes(page.slug) === indexSlug;
  return (
    <main data-nocms-component="payload-page">
      {showHeader && (
        <section className="bg-background pt-8 pb-2 px-6 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <Breadcrumbs items={pageCrumbs(page)} />
            <h1
              {...payloadFieldAttrs({ collection: "pages", docId: page.id, field: "title" })}
              data-role="heading"
              className="mt-3 font-heading text-4xl sm:text-5xl font-bold text-text tracking-tight"
            >
              {page.title}
            </h1>
          </div>
        </section>
      )}
      {blocks.length === 0 ? (
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h1
              {...payloadFieldAttrs({ collection: "pages", docId: page.id, field: "title" })}
              data-role="heading"
              className="font-heading text-4xl sm:text-5xl font-bold text-text"
            >
              {page.title}
            </h1>
            <p className="mt-4 text-muted" data-role="text">
              This page has no blocks yet. Add a Hero or Content Block in the CMS to fill it in.
            </p>
          </div>
        </section>
      ) : (
        <RenderBlocks blocks={blocks} docId={page.id} blocksField="blocks" />
      )}
      {/* Legacy pre-footer band: shown on content pages only; the home/hero-led
          page leads with its own map/states section instead. Suppressed on the
          all-locations index page — there the band would self-link (its
          "View All Locations" CTA points to the page you're already on, and
          AllLocationsIndex renders its own CTA banner). */}
      {!pageLeadsWithHero(page) && !isIndexPage && (
        <LocateNearestCta
          brandName={skinConfig.brandName}
          indexHref={`/${locationsIndexSlug ?? "all-locations"}`}
        />
      )}
    </main>
  );
}

/** Metadata for a rendered page document — title/description from its meta. */
export function pageDocumentMetadata(page: PayloadPage): Metadata {
  return {
    title: page.meta?.title ?? page.title,
    description: page.meta?.description,
  };
}
