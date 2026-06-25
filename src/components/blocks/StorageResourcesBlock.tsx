import * as React from "react";
import { ShieldHalf, Clock, Truck, Ruler, FileText, type LucideIcon } from "lucide-react";
import type { BlockProps, LexicalRoot } from "./types";
import { Lexical, lexicalListItems } from "./Lexical";

/** Strip the top-level list out of a lexical root, leaving the description prose.
 *  Pre-enrichment imports concatenated the legacy description with a bullet list
 *  of resource titles into `body`; with items[] the body is just the guarantee
 *  copy, but this keeps the title-only fallback working for old imports. */
function bodyWithoutList(body?: LexicalRoot | null): LexicalRoot | null {
  const children = body?.root?.children;
  if (!children?.length) return null;
  const rest = children.filter((c) => c.type !== "list");
  if (!rest.length) return null;
  return { root: { type: "root", children: rest } };
}

/** Legacy storage-resource icons (shield/clock/truck …) → lucide; fall back to
 *  the legacy default shield. Keyed by the normalized slug the migration emits. */
const RESOURCE_ICONS: Record<string, LucideIcon> = {
  "shield-halved": ShieldHalf,
  "shield-half": ShieldHalf,
  clock: Clock,
  truck: Truck,
  ruler: Ruler,
  "file-lines": FileText,
  "file-text": FileText,
};
function ResourceIcon({ slug }: { slug?: string | null }) {
  const Icon = (slug && RESOURCE_ICONS[slug]) || ShieldHalf;
  return <Icon className="h-9 w-9" aria-hidden="true" data-nocms-component="storage-resources-block" />;
}

/** Storage resources — legacy two-column treatment: a bordered card listing
 *  resources (icon + title + a descriptive link) on the left, and an
 *  "Our Guarantee" panel (heading + copy + CTA) on the right.
 *
 *  Enriched import: `items[]` carries each resource (icon slug + title label +
 *  descriptive link), `title` the guarantee heading, `body` the guarantee copy,
 *  `links[0]` the CTA. Falls back to the bullet-list titles + a shield icon +
 *  a generic CTA for pre-enrichment imports. */
export function StorageResourcesBlock({ title, body, items, links }: BlockProps) {
  const enriched = (items ?? []).filter((it) => it.label || it.icon || it.link);
  const fallbackTitles = enriched.length === 0 ? lexicalListItems(body) : [];
  const description = bodyWithoutList(body);
  const cta = links?.[0];
  const hasRows = enriched.length > 0 || fallbackTitles.length > 0;

  const rowClass =
    "flex flex-col items-center justify-center text-center gap-4 md:flex-row md:items-center md:justify-start md:text-left md:gap-6 py-5 px-4 md:p-6 border-b border-black/10 last:border-b-0";

  return (
    <section
      data-nocms-component="storage-resources"
      className="bg-background py-14 px-6 sm:px-10 lg:px-16"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
        {hasRows && (
          <ul
            data-payload-subfield={enriched.length ? "items" : "body"}
            className="w-full lg:basis-1/2 lg:shrink-0 bg-surface border border-black/10 rounded-lg overflow-hidden"
          >
            {enriched.length > 0
              ? enriched.map((it, i) => (
                  <li key={i} className={rowClass}>
                    <span className="text-primary shrink-0">
                      <ResourceIcon slug={it.icon} />
                    </span>
                    <div>
                      {it.label && (
                        <span className="font-heading font-bold text-text block">{it.label}</span>
                      )}
                      {it.link?.url && (
                        <a href={it.link.url} className="text-primary text-sm hover:underline">
                          {it.link.label ?? it.link.url}
                        </a>
                      )}
                    </div>
                  </li>
                ))
              : fallbackTitles.map((text, i) => (
                  <li key={i} className={rowClass}>
                    <span className="text-primary shrink-0">
                      <ShieldHalf className="h-9 w-9" aria-hidden="true" />
                    </span>
                    <span className="font-heading font-bold text-text">{text}</span>
                  </li>
                ))}
          </ul>
        )}

        <div className="w-full lg:basis-1/2">
          {title && (
            <h2
              data-payload-subfield="title"
              className="font-heading text-2xl md:text-[2rem] font-bold text-text mb-2"
              style={{ textWrap: "balance" } as React.CSSProperties} data-role="heading"
            >
              {title}
            </h2>
          )}
          {description && (
            <Lexical
              value={description}
              className="prose prose-base text-muted text-base md:text-xl mb-8"
            />
          )}
          <a
            href={cta?.url ?? "/resources"}
            className="inline-flex items-center bg-primary text-white font-semibold px-4 py-2 rounded-full hover:opacity-90 transition" data-role="cta"
          >
            {cta?.label ?? "Storage Resources"}
          </a>
        </div>
      </div>
    </section>
  );
}
