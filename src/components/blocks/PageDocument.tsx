import type { Metadata } from "next";
import type { PayloadPage } from "@/lib/payload";
import { RenderBlocks } from "@/components/blocks/RenderBlocks";
import { payloadFieldAttrs } from "@/lib/payload-attrs";

/**
 * Renders a Payload `pages` document. Used by the root catch-all for imported
 * legacy URLs, and by the static content stubs (about, contact, pricing,
 * resources) when a tenant page with that exact slug exists — an imported
 * legacy page overrides the template's demo content at the same URL.
 */
export function PageDocument({ page }: { page: PayloadPage }) {
  const blocks = page.blocks ?? [];
  return (
    <main data-nocms-component="payload-page">
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
            <p className="mt-4 text-muted">
              This page has no blocks yet. Add a Hero or Content Block in the CMS to fill it in.
            </p>
          </div>
        </section>
      ) : (
        <RenderBlocks blocks={blocks} docId={page.id} blocksField="blocks" />
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
