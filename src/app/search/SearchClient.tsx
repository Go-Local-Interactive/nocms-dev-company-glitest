"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export interface SearchableItem {
  kind: "facility" | "post";
  title: string;
  href: string;
  description: string;
  haystack: string;
}

interface Props {
  items: SearchableItem[];
}

export function SiteSearchClient({ items }: Props) {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");

  const hits = useMemo(() => {
    if (!submitted) return [];
    const needle = submitted.toLowerCase();
    return items.filter((item) => item.haystack.includes(needle));
  }, [submitted, items]);

  return (
    <>
      <section
        data-nocms-component="site-search-header"
        className="bg-surface py-10 lg:py-14"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Search" }]} className="mb-6" />
          <h1
            data-role="heading"
            className="font-heading text-4xl sm:text-5xl font-bold text-text"
          >
            Search
          </h1>
          <p data-role="subheading" className="mt-3 text-lg text-muted max-w-2xl">
            Find a location, an article, or anything else on the site.
          </p>

          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(query.trim());
            }}
            className="mt-6 flex gap-2 max-w-xl"
          >
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted"
                aria-hidden="true"
              />
              <input
                type="search"
                name="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the site…"
                className="w-full h-12 pl-10 pr-3 rounded-md border border-text/15 bg-background text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center bg-primary text-white font-semibold px-5 py-3 rounded-md hover:opacity-90 transition-opacity"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-background">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {!submitted ? (
            <p className="text-muted">Enter a keyword above to begin.</p>
          ) : hits.length === 0 ? (
            <p className="text-muted">
              No results for <strong>{submitted}</strong>.
            </p>
          ) : (
            <ul className="space-y-4">
              {hits.map((hit, idx) => (
                <li key={`${hit.kind}-${idx}-${hit.href}`}>
                  <a
                    href={hit.href}
                    className="block rounded-lg border border-text/10 bg-surface p-5 hover:border-primary hover:shadow-sm transition-all"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {hit.kind === "facility" ? "Location" : "Article"}
                    </span>
                    <p className="mt-1 font-heading text-lg font-semibold text-text">
                      {hit.title}
                    </p>
                    <p className="mt-1 text-sm text-muted">{hit.description}</p>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
