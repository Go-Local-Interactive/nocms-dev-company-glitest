import * as React from "react";
import { ArrowRight, MapPin, ShieldCheck } from "lucide-react";
import type { BlockProps } from "./types";
import { Lexical, lexicalToText, lexicalListItems, lexicalQAPairs } from "./Lexical";
import { fetchLocations, mediaUrl, mediaAlt, mediaArrayUrls } from "@/lib/payload";
import { locationHref } from "@/lib/locations";

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
          <img src={img} alt={mediaAlt(media)} className="w-full h-64 sm:h-80 object-cover rounded-xl" data-payload-subfield="media" />
        )}
        <div>
          {title && <h2 data-payload-subfield="title" className="font-heading text-3xl sm:text-4xl font-bold text-text mb-4">{title}</h2>}
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
          {title && <h2 data-payload-subfield="title" className="font-heading text-3xl sm:text-4xl font-bold text-text mb-4">{title}</h2>}
          <Lexical value={body} className="prose prose-base text-muted" />
        </div>
        {img && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={img} alt={mediaAlt(media)} className="w-full h-72 object-cover rounded-xl shadow-lg" data-payload-subfield="media" />
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
        <img src={img} alt={mediaAlt(media)} className="absolute inset-0 z-0 h-full w-full object-cover" data-payload-subfield="media" />
      )}
      <div aria-hidden="true" className="absolute inset-0 z-[1] bg-text opacity-50" />
      <div className="relative z-[2] flex items-center justify-center text-center min-h-[400px] px-6 py-16">
        <div className="max-w-3xl text-white">
          {title && <h2 data-payload-subfield="title" className="font-heading text-3xl sm:text-5xl font-bold mb-6">{title}</h2>}
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
        {title && <h2 data-payload-subfield="title" className="font-heading text-3xl sm:text-5xl font-bold mb-6">{title}</h2>}
        <Lexical value={body} className="font-body text-lg text-white/90 mb-8" />
        <a href="/reserve-online" className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-md hover:shadow-xl hover:-translate-y-0.5 transition-all">
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
          {title && <h2 data-payload-subfield="title" className="font-heading text-3xl sm:text-4xl font-bold text-text mb-4">{title}</h2>}
          <Lexical value={body} className="prose prose-base text-muted" />
        </div>
        {img && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={img} alt={mediaAlt(media)} className="w-full h-80 object-cover rounded-xl shadow-lg" data-payload-subfield="media" />
        )}
      </div>
    </section>
  );
}

export function ContentBlock({ title, body }: BlockProps) {
  return (
    <section data-nocms-component="content" className="bg-background py-16 px-6 sm:px-10 lg:px-16">
      <div className="max-w-3xl mx-auto">
        {title && <h2 data-payload-subfield="title" className="font-heading text-3xl sm:text-4xl font-bold text-text mb-6">{title}</h2>}
        <Lexical value={body} className="prose prose-base text-muted" />
      </div>
    </section>
  );
}

export function RowGroupBlock({ title, body }: BlockProps) {
  return (
    <section data-nocms-component="row-group" className="bg-background py-16 px-6 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {title && <h2 data-payload-subfield="title" className="font-heading text-3xl font-bold text-text mb-8 text-center">{title}</h2>}
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
        {title && <h2 data-payload-subfield="title" className="font-heading text-xl font-semibold text-text mb-3">{title}</h2>}
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
            className="font-heading text-3xl sm:text-4xl font-bold text-text text-center mb-12"
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
                  <span className="text-2xl text-primary transition-transform group-open:rotate-45 select-none leading-none">+</span>
                </summary>
                <p className="mt-3 font-body text-base text-muted leading-relaxed">{p.a}</p>
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
        {title && <h2 data-payload-subfield="title" className="font-heading text-3xl sm:text-4xl font-bold text-text mb-4">{title}</h2>}
        <Lexical value={body} className="prose prose-base text-muted mb-8" />
        <form className="space-y-4">
          <input type="text" name="name" placeholder="Your name" className="w-full border border-text/20 rounded-md px-4 py-3" />
          <input type="email" name="email" placeholder="Email" className="w-full border border-text/20 rounded-md px-4 py-3" />
          <textarea name="message" placeholder="Message" rows={5} className="w-full border border-text/20 rounded-md px-4 py-3" />
          <button type="submit" className="bg-primary text-white font-semibold px-8 py-3 rounded-md hover:opacity-90 transition">
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
        {title && <h2 data-payload-subfield="title" className="font-heading text-3xl sm:text-4xl font-bold text-text mb-6">{title}</h2>}
        <Lexical value={body} className="prose prose-base text-muted mb-8" />
        <div className="border border-text/10 rounded-lg overflow-hidden text-sm">
          <div className="grid grid-cols-4 bg-surface font-semibold p-4 text-text"><span>Size</span><span>Features</span><span>Price</span><span>Action</span></div>
          <p className="p-6 text-center text-muted">Live unit data wires to the FMS API per facility.</p>
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
            data-payload-subfield="media"
          />
        ) : (
          // Placeholder keeps the block clickable so the inspector can open
          // the media picker even when no image is set yet.
          <div
            data-payload-subfield="media"
            className="aspect-[16/9] w-full rounded-xl border-2 border-dashed border-text/15 bg-surface flex items-center justify-center text-muted"
          >
            <span className="font-body text-sm">Click to add an image</span>
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
        {title && <h2 data-payload-subfield="title" className="font-heading text-3xl font-bold text-text text-center mb-10">{title}</h2>}
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          data-payload-subfield="mediaArray"
        >
          {images.map((m, i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img key={i} src={m.url} alt={m.alt} className="w-full h-48 object-cover rounded-lg" />
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
        {title && <h2 data-payload-subfield="title" className="font-heading text-3xl sm:text-5xl font-bold text-text text-center mb-12">{title}</h2>}
        <Lexical value={body} className="prose prose-base text-muted max-w-2xl mx-auto mb-12 text-center" />
        {images.length > 0 && (
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            data-payload-subfield="mediaArray"
          >
            {images.map((m, i) => (
              <div key={i} className="bg-background rounded-xl p-6 border border-text/10 text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.url} alt={m.alt} className="w-full h-32 object-contain mb-4" />
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
  const images = mediaArrayUrls(mediaArray);
  return (
    <section data-nocms-component="size-guide-preview" className="bg-background py-12 px-6 sm:px-10 lg:px-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-baseline justify-between mb-6">
          {title && <h3 data-payload-subfield="title" className="font-heading text-xl sm:text-2xl font-bold text-text">{title}</h3>}
          <a href="/size-guide" className="text-primary text-sm font-medium hover:underline">Full size guide →</a>
        </div>
        <Lexical value={body} className="prose prose-sm text-muted mb-6" />
        {images.length > 0 && (
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            data-payload-subfield="mediaArray"
          >
            {images.slice(0, 4).map((m, i) => (
              <div key={i} className="bg-surface rounded-lg p-4 border border-text/10 text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.url} alt={m.alt} className="w-full h-20 object-contain mb-2" />
                <p className="text-sm font-medium text-text">{m.alt}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function StorageTypesBlock({ title, body, mediaArray }: BlockProps) {
  const items = lexicalListItems(body);
  const images = mediaArrayUrls(mediaArray);
  return (
    <section data-nocms-component="storage-types" className="bg-background py-20 px-6 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {title && <h2 data-payload-subfield="title" className="font-heading text-3xl sm:text-5xl font-bold text-text text-center mb-16">{title}</h2>}
        {items.length > 0 ? (
          <ul
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            data-payload-subfield="body"
          >
            {items.map((text, i) => {
              const img = images[i];
              return (
                <li key={i} className="bg-surface rounded-xl overflow-hidden border border-text/10 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {img && <img src={img.url} alt={img.alt} className="w-full h-44 object-cover" />}
                  <div className="p-6">
                    <p className="font-heading text-lg font-semibold text-text">{text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <Lexical value={body} className="prose prose-base text-muted max-w-3xl mx-auto" />
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
        {title && <h2 data-payload-subfield="title" className="font-heading text-3xl sm:text-5xl font-bold text-text text-center mb-12">{title}</h2>}
        {locations.length === 0 ? (
          <p className="text-center text-muted">No locations yet.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((l) => (
              <li key={l.id} className="bg-background rounded-xl border border-text/10 p-6 shadow-sm">
                <h3 className="font-heading text-lg font-semibold text-text mb-2">{l.title}</h3>
                <p className="font-body text-sm text-muted mb-4">
                  {[l.address?.street, l.city, l.state].filter(Boolean).join(", ")}
                </p>
                <a href={locationHref(l)} className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:gap-2 transition-all">
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

export async function MapLocationsBlock({ title }: BlockProps) {
  const locations = await fetchLocations(50);
  return (
    <section data-nocms-component="map-locations" className="bg-background py-20 px-6 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10">
        <div className="bg-surface border border-text/10 rounded-xl min-h-[420px] flex items-center justify-center text-muted">
          <span className="flex items-center gap-2"><MapPin className="h-5 w-5" /> Map renders client-side</span>
        </div>
        <div>
          {title && <h2 data-payload-subfield="title" className="font-heading text-3xl font-bold text-text mb-6">{title}</h2>}
          <ul className="divide-y divide-text/10">
            {locations.map((l) => (
              <li key={l.id} className="py-4">
                <a href={locationHref(l)} className="block hover:bg-surface rounded p-2 -mx-2 transition">
                  <p className="font-heading font-semibold text-text">{l.title}</p>
                  {l.city && <p className="font-body text-sm text-muted">{l.city}, {l.state}</p>}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function SearchFormBlock({ title }: BlockProps) {
  return (
    <section data-nocms-component="search-form" className="bg-background py-12 px-6 sm:px-10 lg:px-16">
      <div className="max-w-3xl mx-auto">
        {title && <h2 data-payload-subfield="title" className="font-heading text-2xl font-bold text-text mb-4 text-center">{title}</h2>}
        <form action="/search" method="get" className="flex items-stretch gap-3">
          <input
            type="search"
            name="q"
            placeholder="City, ZIP, or facility name"
            className="flex-1 border border-text/20 rounded-md px-4 py-3 text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button type="submit" className="bg-primary text-white font-semibold px-6 py-3 rounded-md hover:opacity-90 transition">
            Search
          </button>
        </form>
      </div>
    </section>
  );
}

export function SpacerBlock() {
  return <div data-nocms-component="spacer" className="h-16 sm:h-24" />;
}
