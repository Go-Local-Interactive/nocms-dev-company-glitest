import * as React from "react";
import type { UnitGroup } from "@/types/UnitGroup";

/**
 * Lighter card-grid unit-listing variant. Source:
 * storage-theme-payload `src/components/CubbyUnitTable` — that file is a thin
 * wrapper around a `<cubby-facility>` web component injected by Cubby's CDN.
 * Replaced here with a card-style listing of `UnitGroup`s, vendor-agnostic.
 *
 * Editor contract: section heading carries `data-role="heading"`.
 * Card content (size/price) is data-derived and unrolelinked.
 */

interface CubbyUnitTableProps {
  heading?: string;
  units: UnitGroup[];
  layout?: "list" | "grid";
  reserveHrefBase?: string;
}

const formatRate = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

export function CubbyUnitTable({
  heading = "Available units",
  units,
  layout = "grid",
  reserveHrefBase = "/reserve",
}: CubbyUnitTableProps) {
  const containerClass =
    layout === "grid"
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      : "flex flex-col gap-3";

  return (
    <section data-nocms-component="cubby-unit-table" className="py-12 lg:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2
          data-role="heading"
          className="font-heading text-2xl sm:text-3xl font-bold text-text mb-6"
        >
          {heading}
        </h2>
        {units.length === 0 ? (
          <p className="text-zinc-600">No units available right now.</p>
        ) : (
          <ul className={containerClass}>
            {units.map((u) => {
              const sqft = u.unitGroupDepth * u.unitGroupWidth;
              const soldOut = u.availableUnitCount <= 0;
              return (
                <li
                  key={u.unitGroupUuid}
                  className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-semibold text-text">{sqft} sq ft</p>
                    <p className="text-sm text-zinc-600">
                      {u.unitGroupDepth}&apos; &times; {u.unitGroupWidth}&apos; — {u.unitType}
                    </p>
                    <p className="mt-1 font-bold text-primary">
                      {formatRate(u.currentWebRate)}
                      <span className="text-zinc-500 font-normal text-sm"> /mo</span>
                    </p>
                  </div>
                  {soldOut ? (
                    <span className="text-sm text-zinc-400">Sold out</span>
                  ) : (
                    <a
                      href={`${reserveHrefBase}/${u.unitGroupUuid}`}
                      className="inline-block bg-primary text-white px-4 py-2 rounded-md font-semibold text-sm hover:opacity-90"
                    >
                      Reserve
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
