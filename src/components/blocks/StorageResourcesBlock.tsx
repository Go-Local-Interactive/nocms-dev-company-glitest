import * as React from "react";
import { ArrowRight } from "lucide-react";
import type { BlockProps } from "./types";
import { mediaArrayUrls } from "@/lib/payload";
import { Lexical, lexicalListItems } from "./Lexical";

/** Storage resources — title + body (intro paragraph or list of resource titles).
 *  If body has list items, each becomes a card; otherwise renders as a single
 *  intro section. mediaArray (optional) provides per-card thumbnails. */
export function StorageResourcesBlock({ title, body, mediaArray }: BlockProps) {
  const items = lexicalListItems(body);
  const images = mediaArrayUrls(mediaArray);
  return (
    <section data-nocms-component="storage-resources" className="bg-surface py-20 px-6 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {title && (
          <h2
            data-payload-subfield="title"
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-text text-center mb-16"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {title}
          </h2>
        )}
        {items.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" data-payload-subfield="body">
            {items.map((text, i) => {
              const img = images[i];
              return (
                <li key={i} className="bg-background rounded-xl border border-text/10 overflow-hidden shadow-sm hover:shadow-md transition">
                  {img && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={img.url} alt={img.alt} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-6">
                    <p className="font-heading text-lg font-semibold text-text mb-3">{text}</p>
                    <a href="/resources" className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:gap-2 transition-all">
                      Read more <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="max-w-3xl mx-auto text-center">
            <Lexical value={body} className="prose prose-base text-muted mb-8" />
            <a href="/resources" className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-md hover:opacity-90 transition">
              Browse all resources <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
