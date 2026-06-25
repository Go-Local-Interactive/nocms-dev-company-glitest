import * as React from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import type { BlockProps, LexicalNode, LexicalRoot } from "./types";
import { Lexical, lexicalToText, lexicalQAPairs } from "./Lexical";
import { fetchLocations, mediaUrl, mediaAlt, mediaArrayUrls } from "@/lib/payload";
import { locationHref } from "@/lib/locations";

/** Split a lexical body into per-heading groups: each group is a heading node's
 *  plain text plus the (paragraph/list) nodes that follow until the next heading.
 *  Used by card-grid renderers (e.g. Storage Types) where the legacy body is an
 *  `h3` per item followed by its content paragraph(s). */
function lexicalHeadingGroups(
  value?: LexicalRoot | null,
): Array<{ heading: string; body: LexicalRoot }> {
  if (!value?.root?.children?.length) return [];
  const text = (n: LexicalNode): string => {
    const out: string[] = [];
    const walk = (x: LexicalNode) => {
      if (x.type === "text" && typeof x.text === "string") out.push(x.text);
      x.children?.forEach(walk);
    };
    walk(n);
    return out.join(" ").trim();
  };
  const groups: Array<{ heading: string; children: LexicalNode[] }> = [];
  for (const node of value.root.children) {
    if (node.type === "heading") {
      groups.push({ heading: text(node), children: [] });
    } else if (groups.length > 0) {
      groups[groups.length - 1].children.push(node);
    }
  }
  return groups.map((g) => ({
    heading: g.heading,
    body: { root: { type: "root" as const, children: g.children } },
  }));
}

/** Baseline renderers — functional but visually simple implementations for the
 *  20 blocks that don't ship with the home-page seed. Each consumes the same
 *  atomic shape and renders predictably. Visual polish lives in later passes. */

/** Banner — smaller hero with image + text inline. */
export function BannerBlock({ title, body, media }: BlockProps) {
  const img = mediaUrl(media);
  return (
    <section data-nocms-component="banner" className="bg-surface py-16 px-6 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {img && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={img} alt={mediaAlt(media)} className="w-full h-64 sm:h-80 object-cover rounded-xl" data-payload-subfield="media" data-role="media" />
        )}
        <div>
          {title && <h2 data-payload-subfield="title" className="font-heading text-3xl sm:text-4xl font-bold text-text mb-4" data-role="heading">{title}</h2>}
          <Lexical value={body} className="prose prose-base text-muted" />
        </div>
      </div>
    </section>
  );
}

export function FacilityBannerBlock({ title, body, media }: BlockProps) {
  const img = mediaUrl(media);
  return (
    <section data-nocms-component="facility-banner" className="bg-background py-16 px-6 sm:px-10 lg:px-16 border-y border-text/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-12 items-center">
        <div>
          {title && <h2 data-payload-subfield="title" className="font-heading text-3xl sm:text-4xl font-bold text-text mb-4" data-role="heading-2">{title}</h2>}
          <Lexical value={body} className="prose prose-base text-muted" />
        </div>
        {img && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={img} alt={mediaAlt(media)} className="w-full h-72 object-cover rounded-xl shadow-lg" data-payload-subfield="media" data-role="media-2" />
        )}
      </div>
    </section>
  );
}

export function MediaOverlayBlock({ title, body, media }: BlockProps) {
  const img = mediaUrl(media);
  return (
    <section data-nocms-component="media-overlay" className="relative w-full overflow-hidden min-h-[400px]">
      {img && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={img} alt={mediaAlt(media)} className="absolute inset-0 z-0 h-full w-full object-cover" data-payload-subfield="media" data-role="media-3" />
      )}
      <div aria-hidden="true" className="absolute inset-0 z-[1] bg-text opacity-50" />
      <div className="relative z-[2] flex items-center justify-center text-center min-h-[400px] px-6 py-16">
        <div className="max-w-3xl text-white">
          {title && <h2 data-payload-subfield="title" className="font-heading text-3xl sm:text-5xl font-bold mb-6" data-role="heading-3">{title}</h2>}
          <Lexical value={body} className="font-body text-lg text-white/90" />
        </div>
      </div>
    </section>
  );
}

export function CallToActionBlock({ title, body }: BlockProps) {
  return (
    <section data-nocms-component="call-to-action" className="bg-primary text-white py-20 px-6 sm:px-10 lg:px-16">
      <div className="max-w-4xl mx-auto text-center">
        {title && <h2 data-payload-subfield="title" className="font-heading text-3xl sm:text-5xl font-bold mb-6" data-role="heading-4">{title}</h2>}
        <Lexical value={body} className="font-body text-lg text-white/90 mb-8" />
        <a href="/reserve-online" className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-md hover:shadow-xl hover:-translate-y-0.5 transition-all" data-role="text">
          Reserve a unit
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}

export function StorageDefenderBlock({ title, body, media }: BlockProps) {
  const img = mediaUrl(media);
  return (
    <section data-nocms-component="storage-defender" className="bg-surface py-16 px-6 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium mb-4">
            <ShieldCheck className="h-4 w-4" />
            Protection
          </div>
          {title && <h2 data-payload-subfield="title" className="font-heading text-3xl sm:text-4xl font-bold text-text mb-4" data-role="heading-5">{title}</h2>}
          <Lexical value={body} className="prose prose-base text-muted" />
        </div>
        {img && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={img} alt={mediaAlt(media)} className="w-full h-80 object-cover rounded-xl shadow-lg" data-payload-subfield="media" data-role="media-4" />
        )}
      </div>
    </section>
  );
}

export function ContentBlock({ title, body }: BlockProps) {
  return (
    <section data-nocms-component="content" className="bg-background py-16 px-6 sm:px-10 lg:px-16">
      <div className="max-w-3xl mx-auto">
        {title && <h2 data-payload-subfield="title" className="font-heading text-3xl sm:text-4xl font-bold text-text mb-6" data-role="heading-6">{title}</h2>}
        <Lexical value={body} className="prose prose-base text-muted" />
      </div>
    </section>
  );
}

export function RowGroupBlock({ title, body }: BlockProps) {
  return (
    <section data-nocms-component="row-group" className="bg-background py-16 px-6 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {title && <h2 data-payload-subfield="title" className="font-heading text-3xl font-bold text-text mb-8 text-center" data-role="heading-7">{title}</h2>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Lexical value={body} className="prose prose-base text-muted" />
        </div>
      </div>
    </section>
  );
}

export function CodeBlock({ title, body }: BlockProps) {
  const text = lexicalToText(body);
  return (
    <section data-nocms-component="code" className="bg-background py-12 px-6 sm:px-10 lg:px-16">
      <div className="max-w-4xl mx-auto">
        {title && <h2 data-payload-subfield="title" className="font-heading text-xl font-semibold text-text mb-3" data-role="heading-8">{title}</h2>}
        <pre
          className="bg-text text-white rounded-lg p-6 overflow-x-auto"
          data-payload-subfield="body"
        ><code className="font-mono text-sm">{text}</code></pre>
      </div>
    </section>
  );
}

export function FaqBlock({ title, body }: BlockProps) {
  const pairs = lexicalQAPairs(body);
  return (
    <section data-nocms-component="faq" className="bg-surface py-20 px-6 sm:px-10 lg:px-16">
      <div className="max-w-3xl mx-auto">
        {title && (
          <h2
            data-payload-subfield="title"
            className="font-heading text-3xl sm:text-4xl font-bold text-text text-center mb-12" data-role="heading-9"
          >
            {title}
          </h2>
        )}
        {pairs.length > 0 ? (
          <div
            className="divide-y divide-text/10 border-y border-text/10"
            data-payload-subfield="body"
          >
            {pairs.map((p, i) => (
              <details key={i} className="group py-5">
                <summary className="flex items-start justify-between gap-4 cursor-pointer list-none font-heading text-lg font-semibold text-text">
                  <span>{p.q}</span>
                  <span className="text-2xl text-primary transition-transform group-open:rotate-45 select-none leading-none" data-role="text-2">+</span>
                </summary>
                <p className="mt-3 font-body text-base text-muted leading-relaxed" data-role="subheading">{p.a}</p>
              </details>
            ))}
          </div>
        ) : (
          <Lexical value={body} className="prose prose-base text-muted" />
        )}
      </div>
    </section>
  );
}

export function ContactFormBlock({ title, body }: BlockProps) {
  return (
    <section data-nocms-component="contact-form" className="bg-background py-16 px-6 sm:px-10 lg:px-16">
      <div className="max-w-2xl mx-auto">
        {title && <h2 data-payload-subfield="title" className="font-heading text-3xl sm:text-4xl font-bold text-text mb-4" data-role="heading-10">{title}</h2>}
        <Lexical value={body} className="prose prose-base text-muted mb-8" />
        <form className="space-y-4">
          <input type="text" name="name" placeholder="Your name" className="w-full border border-text/20 rounded-md px-4 py-3" />
          <input type="email" name="email" placeholder="Email" className="w-full border border-text/20 rounded-md px-4 py-3" />
          <textarea name="message" placeholder="Message" rows={5} className="w-full border border-text/20 rounded-md px-4 py-3" />
          <button type="submit" className="bg-primary text-white font-semibold px-8 py-3 rounded-md hover:opacity-90 transition" data-role="cta">
            Send message
          </button>
        </form>
      </div>
    </section>
  );
}

export function UnitsTableBlock({ title, body }: BlockProps) {
  return (
    <section data-nocms-component="units-table" className="bg-background py-16 px-6 sm:px-10 lg:px-16">
      <div className="max-w-5xl mx-auto">
        {title && <h2 data-payload-subfield="title" className="font-heading text-3xl sm:text-4xl font-bold text-text mb-6" data-role="heading-11">{title}</h2>}
        <Lexical value={body} className="prose prose-base text-muted mb-8" />
        <div className="border border-text/10 rounded-lg overflow-hidden text-sm">
          <div className="grid grid-cols-4 bg-surface font-semibold p-4 text-text"><span data-role="text-3">Size</span><span data-role="text-4">Features</span><span data-role="text-5">Price</span><span data-role="text-6">Action</span></div>
          <p className="p-6 text-center text-muted" data-role="text-7">Live unit data wires to the FMS API per facility.</p>
        </div>
      </div>
    </section>
  );
}

export function MediaBlockBlock({ title, media }: BlockProps) {
  const img = mediaUrl(media);
  return (
    <section data-nocms-component="media-block" className="bg-background py-12 px-6 sm:px-10 lg:px-16">
      <div className="max-w-4xl mx-auto">
        {img ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={img}
            alt={mediaAlt(media)}
            className="w-full h-auto rounded-xl shadow-md"
            data-payload-subfield="media" data-role="media-5"
          />
        ) : (
          // Placeholder keeps the block clickable so the inspector can open
          // the media picker even when no image is set yet.
          <div
            data-payload-subfield="media"
            className="aspect-[16/9] w-full rounded-xl border-2 border-dashed border-text/15 bg-surface flex items-center justify-center text-muted"
          >
            <span className="font-body text-sm" data-role="text-8">Click to add an image</span>
          </div>
        )}
        {title && <p data-payload-subfield="title" className="text-center text-sm text-muted mt-3">{title}</p>}
      </div>
    </section>
  );
}

export function GalleryBlock({ title, mediaArray }: BlockProps) {
  const images = mediaArrayUrls(mediaArray);
  if (images.length === 0) return null;
  return (
    <section data-nocms-component="gallery" className="bg-background py-16 px-6 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {title && <h2 data-payload-subfield="title" className="font-heading text-3xl font-bold text-text text-center mb-10" data-role="heading-12">{title}</h2>}
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          data-payload-subfield="mediaArray"
        >
          {images.map((m, i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img key={i} src={m.url} alt={m.alt} className="w-full h-48 object-cover rounded-lg" data-role="media-6" />
          ))}
        </div>
      </div>
    </section>
  );
}

export function SizeGuideBlock({ title, body, mediaArray }: BlockProps) {
  const images = mediaArrayUrls(mediaArray);
  return (
    <section data-nocms-component="size-guide" className="bg-surface py-20 px-6 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {title && <h2 data-payload-subfield="title" className="font-heading text-3xl sm:text-5xl font-bold text-text text-center mb-12" data-role="heading-13">{title}</h2>}
        <Lexical value={body} className="prose prose-base text-muted max-w-2xl mx-auto mb-12 text-center" />
        {images.length > 0 && (
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            data-payload-subfield="mediaArray"
          >
            {images.map((m, i) => (
              <div key={i} className="bg-background rounded-xl p-6 border border-text/10 text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.url} alt={m.alt} className="w-full h-32 object-contain mb-4" data-role="media-7" />
                <p className="font-heading text-sm font-semibold text-text">{m.alt}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function SizeGuidePreviewBlock({ title, body, mediaArray }: BlockProps) {
  // Legacy "Unsure how much square footage…" (size-guide-preview): centered
  // heading + subheading + a primary pill CTA, then a row of 3 size-category
  // cards (image tile on a neutral panel, a pill-shaped name badge, a short
  // description, and a "See Size Guide" link). Legacy sources the categories
  // from the SE unit-category API (tenant-specific); the template renders from
  // `mediaArray` when migrated, otherwise shows placeholder size tiles so the
  // layout/height matches legacy.
  const images = mediaArrayUrls(mediaArray);
  const subheading = lexicalToText(body);
  // Up to three preview cards, matching legacy's `slice(0, 3)`.
  const cards = images.length > 0 ? images.slice(0, 3) : [null, null, null];
  return (
    <section data-nocms-component="size-guide-preview" className="bg-background py-12 px-6 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col text-center mx-2 my-4">
          {title && (
            <h2 data-payload-subfield="title" className="font-heading text-2xl md:text-[2rem] font-bold text-text mx-6 mb-6" data-role="heading-14">
              {title}
            </h2>
          )}
          {subheading ? (
            <p data-payload-subfield="body" className="font-body text-base md:text-xl text-muted mb-6" data-role="subheading-2">
              {subheading}
            </p>
          ) : (
            <Lexical value={body} className="prose prose-base text-muted mb-6 mx-auto" />
          )}
          <a
            href="/size-guide"
            className="w-fit mx-auto mb-11 inline-flex items-center justify-center bg-primary text-white font-semibold px-6 py-2 rounded-full hover:opacity-90 transition" data-role="cta-2"
          >
            Size Guide
          </a>
          <div
            className="flex flex-col gap-4 justify-self-center md:flex-row"
            data-payload-subfield="mediaArray"
          >
            {cards.map((m, i) => (
              <div key={i} className="flex flex-1 flex-col items-center text-left md:grid md:[grid-template-rows:auto_auto_1fr_auto]">
                <div className="flex items-center justify-center w-full h-60 bg-surface border border-text/10 rounded-lg">
                  {m ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={m.url} alt={m.alt} className="w-44 h-auto object-contain" data-role="media-8" />
                  ) : (
                    <span className="text-muted text-sm" data-role="text-9">Unit size</span>
                  )}
                </div>
                <h3 className="flex items-center justify-center self-start text-base font-normal text-text bg-primary/5 h-8 mt-8 rounded-full px-4 max-w-fit" data-role="heading-15">
                  {m?.alt || "Size"}
                </h3>
                <p className="self-start font-body text-base text-text mt-2" data-role="subheading-3">
                  Common unit dimensions
                </p>
                <a href="/size-guide" className="self-start mb-12 mt-2 text-primary underline hover:no-underline" data-role="text-10">
                  See Size Guide
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function StorageTypesBlock({ title, body, mediaArray }: BlockProps) {
  // Legacy "Check Out Our Storage Types" (storage-types-layout-2): a single grid
  // (1 / 2 / 3 cols) whose FIRST cell is a header card (heading + "Find a Location"
  // CTA) styled like the type cards, followed by one card per storage type
  // (h3 + content paragraph + "Learn More" link). The migrated body is an `h3`
  // per type followed by its content paragraph(s), so split on headings.
  const groups = lexicalHeadingGroups(body);
  // Per-type photos are migration-dependent (enrich `items[]` with media on the
  // re-import). Until a card has an image, it renders text-only — matching the
  // current legacy render, which ships no per-card photo.
  const images = mediaArrayUrls(mediaArray);
  return (
    <section data-nocms-component="storage-types" className="bg-background py-12 lg:py-16 px-10">
      <div className="max-w-[1360px] mx-auto">
        {groups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {/* Header card — first grid cell (no border, matching legacy) */}
            <div className="bg-surface rounded-lg p-8 md:p-10 flex flex-col">
              {title && (
                <h2
                  data-payload-subfield="title"
                  className="font-heading text-2xl md:text-[2rem] font-bold text-text mb-8" data-role="heading-16"
                >
                  {title}
                </h2>
              )}
              <a
                href="/locations"
                className="self-start inline-flex items-center gap-2 bg-primary text-white font-semibold px-4 py-2 rounded-full hover:opacity-90 transition" data-role="cta-3"
              >
                Find a Location
              </a>
            </div>
            {/* Storage type cards */}
            {groups.map((g, i) => {
              const img = images[i];
              return (
                <div
                  key={i}
                  className="bg-[#f4f3fe] rounded-lg p-8 md:p-10 flex flex-col items-start"
                  data-payload-subfield="body"
                >
                  {img && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={img.url} alt={img.alt} className="w-full h-40 object-cover rounded-lg mb-6" data-role="media-9" />
                  )}
                  <h3 className="font-heading text-2xl font-bold text-text mb-2" data-role="heading-17">{g.heading}</h3>
                  <Lexical value={g.body} className="prose prose-base text-muted mb-3" subfield="body" />
                  <a href="/locations" className="font-semibold text-primary mt-auto hover:underline" data-role="text-11">
                    Learn More
                  </a>
                </div>
              );
            })}
          </div>
        ) : (
          <>
            {title && (
              <h2 data-payload-subfield="title" className="font-heading text-3xl sm:text-5xl font-bold text-text text-center mb-16" data-role="heading-18">
                {title}
              </h2>
            )}
            <Lexical value={body} className="prose prose-base text-muted max-w-3xl mx-auto" />
          </>
        )}
      </div>
    </section>
  );
}

export async function FeaturedLocationsBlock({ title }: BlockProps) {
  const locations = await fetchLocations(6);
  return (
    <section data-nocms-component="featured-locations" className="bg-surface py-20 px-6 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {title && <h2 data-payload-subfield="title" className="font-heading text-3xl sm:text-5xl font-bold text-text text-center mb-12" data-role="heading-19">{title}</h2>}
        {locations.length === 0 ? (
          <p className="text-center text-muted" data-role="text-12">No locations yet.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((l) => (
              <li key={l.id} className="bg-background rounded-xl border border-text/10 p-6 shadow-sm">
                <h3 className="font-heading text-lg font-semibold text-text mb-2" data-role="heading-20">{l.title}</h3>
                <p className="font-body text-sm text-muted mb-4">
                  {[l.address?.street, l.city, l.state].filter(Boolean).join(", ")}
                </p>
                <a href={locationHref(l)} className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:gap-2 transition-all" data-role="text-13">
                  View location <ArrowRight className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export function SearchFormBlock({ title }: BlockProps) {
  return (
    <section data-nocms-component="search-form" className="bg-background py-12 px-6 sm:px-10 lg:px-16">
      <div className="max-w-3xl mx-auto">
        {title && <h2 data-payload-subfield="title" className="font-heading text-2xl font-bold text-text mb-4 text-center" data-role="heading-21">{title}</h2>}
        <form action="/search" method="get" className="flex items-stretch gap-3">
          <input
            type="search"
            name="q"
            placeholder="City, ZIP, or facility name"
            className="flex-1 border border-text/20 rounded-md px-4 py-3 text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button type="submit" className="bg-primary text-white font-semibold px-6 py-3 rounded-md hover:opacity-90 transition" data-role="cta-4">
            Search
          </button>
        </form>
      </div>
    </section>
  );
}

export function SpacerBlock() {
  // Modest default (legacy spacers were small here); the legacy per-spacer height
  // isn't carried by the migration yet, so this is a fixed, restrained gap.
  return <div data-nocms-component="spacer" className="h-8 sm:h-12" />;
}
