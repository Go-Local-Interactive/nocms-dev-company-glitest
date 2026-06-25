"use client";

import * as React from "react";
import Image from "next/image";

/**
 * SizeGuide — tabbed size comparison. Source: storage-theme-payload
 * `src/blocks/SizeGuide`. Replaces the Storage Essentials API fetch + Payload
 * tenant lookup with a static `categories` prop, and the imperative
 * vanilla-JS tab handlers with React state. The mobile dropdown becomes a
 * native <details> for the same reason FaqAccordion did.
 *
 * Editor contract: section heading carries `data-role="heading"`. Tabs and
 * panel content have no roles (one-role-per-component rule).
 */

export interface SizeCategory {
  id: string;
  name: string;
  description?: string;
  longDescription?: string;
  imageSrc?: string;
}

interface SizeGuideProps {
  heading?: string;
  categories?: SizeCategory[];
}

const defaultCategories: SizeCategory[] = [
  {
    id: "small",
    name: "Small (5x5 – 5x10)",
    description: "Closet-sized space for boxes, seasonal gear, and small furniture.",
    longDescription:
      "A 5x5 fits the contents of a small closet. A 5x10 holds the contents of a large closet or a small one-bedroom — boxes, a mattress set, a few small pieces of furniture.",
  },
  {
    id: "medium",
    name: "Medium (10x10 – 10x15)",
    description: "Holds a 1–2 bedroom apartment with appliances.",
    longDescription:
      "A 10x10 is the most popular size. It holds the contents of a one-bedroom apartment plus appliances. A 10x15 fits a two-bedroom — appliances, mattress sets, dressers, boxes.",
  },
  {
    id: "large",
    name: "Large (10x20 – 10x30)",
    description: "Holds a 3–5 bedroom house, business inventory, or vehicles.",
    longDescription:
      "A 10x20 fits the contents of a three-bedroom house with appliances. A 10x30 fits a five-bedroom plus large items like boats or vehicles. Common for moves, renovations, and business inventory.",
  },
];

export function SizeGuide({
  heading = "Storage unit size guide",
  categories = defaultCategories,
}: SizeGuideProps) {
  const [activeId, setActiveId] = React.useState(categories[0]?.id ?? "");
  if (!categories.length) return null;

  const active = categories.find((c) => c.id === activeId) ?? categories[0]!;

  return (
    <section
      data-nocms-component="size-guide-flat"
      className="py-16 lg:py-20"
      aria-label="Storage unit size guide"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2
            data-role="heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-text"
          >
            {heading}
          </h2>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          <div
            role="tablist"
            aria-label="Storage unit categories"
            className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible"
          >
            {categories.map((category) => {
              const isActive = category.id === active.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveId(category.id)}
                  className={`text-left px-4 py-3 rounded-lg border transition-colors shrink-0 ${
                    isActive
                      ? "bg-primary text-white border-primary"
                      : "bg-surface text-text border-text/5 hover:border-primary/30"
                  }`}
                >
                  <div className="font-semibold">{category.name}</div>
                  {category.description && (
                    <div
                      className={`text-sm mt-1 ${
                        isActive ? "text-white/85" : "text-muted"
                      }`}
                    >
                      {category.description}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            className="bg-surface rounded-xl border border-text/5 p-6 lg:p-8"
          >
            {active.imageSrc && (
              <div className="relative aspect-[4/3] mb-6 rounded-lg overflow-hidden">
                <Image
                  src={active.imageSrc}
                  alt={`${active.name} storage unit`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            )}
            <div className="font-heading text-2xl font-bold text-text mb-3">
              {active.name}
            </div>
            <div className="text-muted leading-relaxed space-y-3">
              {(active.longDescription ?? active.description ?? "")
                .split("\n")
                .filter(Boolean)
                .map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
