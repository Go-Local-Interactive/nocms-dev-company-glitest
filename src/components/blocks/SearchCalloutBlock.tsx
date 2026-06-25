import * as React from "react";
import { Search, ArrowRight } from "lucide-react";
import type { BlockProps } from "./types";
import { lexicalToText } from "./Lexical";

/** Search callout — full-width banner with a search input and primary CTA.
 *  title → heading, body (first paragraph) → subheading. */
export function SearchCalloutBlock({ title, body }: BlockProps) {
  const sub = lexicalToText(body);
  return (
    <section data-nocms-component="search-callout" className="bg-primary text-white py-20 px-6 sm:px-10 lg:px-16">
      <div className="max-w-4xl mx-auto text-center">
        {title && (
          <h2
            data-payload-subfield="title"
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {title}
          </h2>
        )}
        {sub && (
          <p data-payload-subfield="body" className="font-body text-lg text-white/90 mb-10">
            {sub}
          </p>
        )}
        <form action="/search" method="get" className="flex flex-col sm:flex-row items-stretch gap-3 max-w-2xl mx-auto">
          <label htmlFor="search-callout-input" className="sr-only">
            Search by city or ZIP
          </label>
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" aria-hidden="true" />
            <input
              id="search-callout-input"
              type="search"
              name="q"
              placeholder="City or ZIP"
              className="w-full bg-white border-0 rounded-md pl-12 pr-4 py-4 text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-md hover:bg-surface transition"
          >
            Find a unit
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </section>
  );
}
