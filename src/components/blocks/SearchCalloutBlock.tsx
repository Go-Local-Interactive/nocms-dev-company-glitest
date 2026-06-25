import * as React from "react";
import type { BlockProps } from "./types";
import { lexicalToText } from "./Lexical";

/** Search callout — legacy-faithful port of storage-theme-payload's
 *  SearchCallout Layout 1 ("Find a Unit Right for You Today!").
 *
 *  Legacy is a RESTRAINED band, not a saturated primary fill: neutral page
 *  background (`bg-background`), dark text, modest vertical padding
 *  (`py-8 md:py-10 lg:py-12` → ~h172), a centered bold heading, and a single
 *  primary CTA below it. There is NO search input form in legacy — it's a
 *  call-to-action button — so we render the button, not a `/search` field.
 *
 *  title → centered heading; body (first paragraph) → CTA button label
 *  (the migrated `buttonText`, e.g. "Rent or Reserve Now"). The button links
 *  to `/search`, the in-template "find a unit" destination. */
export function SearchCalloutBlock({ title, body }: BlockProps) {
  const cta = lexicalToText(body);
  return (
    <section
      data-nocms-component="search-callout"
      className="bg-background text-text py-8 md:py-10 lg:py-12 px-6 sm:px-10 lg:px-16"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        {title && (
          <h2
            data-payload-subfield="title"
            className="font-heading text-2xl md:text-[2rem] font-bold leading-tight"
            style={{ textWrap: "balance" } as React.CSSProperties} data-role="heading"
          >
            {title}
          </h2>
        )}
        {cta && (
          <a
            data-payload-subfield="body"
            href="/search"
            className="mt-4 inline-flex items-center justify-center h-10 bg-primary text-white text-lg font-bold px-6 rounded-full hover:opacity-90 transition" data-role="cta"
          >
            {cta}
          </a>
        )}
      </div>
    </section>
  );
}
