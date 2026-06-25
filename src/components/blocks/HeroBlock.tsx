import * as React from "react";
import { Search } from "lucide-react";
import type { BlockProps } from "./types";
import { mediaUrl, mediaAlt } from "@/lib/payload";
import { lexicalToText } from "./Lexical";

/** Hero — full-bleed background image + heading + body + inline ZIP/location
 *  search. Matches the CloudFront reference home hero. title → <h1>, body
 *  (first paragraph) → subheading, media → bg image. Subfield attrs let the
 *  inspector pre-focus the right field in the editor. */
export function HeroBlock({ title, body, media }: BlockProps) {
  const subheading = lexicalToText(body) || undefined;
  const bg = mediaUrl(media) ?? "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80";
  return (
    <section
      data-nocms-component="hero"
      className="relative w-full overflow-hidden min-h-[520px]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        data-payload-subfield="media"
        src={bg}
        alt={mediaAlt(media)}
        className="absolute inset-0 z-0 h-full w-full object-cover"
        loading="eager"
      />
      <div aria-hidden="true" className="absolute inset-0 z-[1] bg-primary/70" />
      <div className="relative z-[2] flex h-full items-center justify-center text-center min-h-[520px] px-6 py-20 sm:px-10 lg:px-16">
        <div className="max-w-3xl w-full">
          {title && (
            <h1
              data-role="heading"
              data-payload-subfield="title"
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-5"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {title}
            </h1>
          )}
          {subheading && (
            <p
              data-role="subheading"
              data-payload-subfield="body"
              className="font-body text-lg sm:text-xl text-white/90 leading-relaxed mb-8 max-w-2xl mx-auto"
            >
              {subheading}
            </p>
          )}
          <form
            action="/search"
            method="get"
            className="flex flex-col sm:flex-row items-stretch gap-3 max-w-xl mx-auto bg-white/95 rounded-lg p-2 shadow-2xl"
          >
            <label htmlFor="hero-search" className="sr-only">
              City or ZIP code
            </label>
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted"
                aria-hidden="true"
              />
              <input
                id="hero-search"
                type="search"
                name="q"
                placeholder="ZIP code or city"
                className="w-full bg-transparent border-0 rounded-md pl-12 pr-4 py-3 text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 bg-accent text-text font-semibold px-8 py-3 rounded-md hover:opacity-90 transition"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
