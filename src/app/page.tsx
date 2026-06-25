import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchPageBySlug } from "@/lib/payload";
import { RenderBlocks } from "@/components/blocks/RenderBlocks";
import { payloadFieldAttrs } from "@/lib/payload-attrs";
import skinConfig from "@/skin.config";

const HOME_SLUG = "home";

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchPageBySlug(HOME_SLUG);
  if (!page) {
    return { title: skinConfig.brandName, description: skinConfig.tagline };
  }
  return {
    title: page.meta?.title ?? page.title,
    description: page.meta?.description ?? skinConfig.tagline,
  };
}

export default async function HomePage() {
  const page = await fetchPageBySlug(HOME_SLUG);
  if (!page) notFound();

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
              This page has no blocks yet. Add a block in the CMS to fill it in.
            </p>
          </div>
        </section>
      ) : (
        <RenderBlocks blocks={blocks} docId={page.id} blocksField="blocks" />
      )}
    </main>
  );
}
