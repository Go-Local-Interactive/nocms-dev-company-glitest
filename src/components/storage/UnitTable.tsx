import * as React from "react";
import type { UnitGroup } from "@/types/UnitGroup";

/**
 * Local UnitTable — replaces the third-party glidevvr unit-table widget
 * with a static `<table>` rendered from a `UnitGroup[]` prop. Drops the
 * live rate-fetch / availability sync; this version is purely presentational
 * and accepts pre-fetched data from the caller.
 *
 * Source: storage-theme-payload `src/components/UnitTable/index.client.tsx`
 * (kept as inspiration only — that file is a thin wrapper around the npm
 * package, which we are intentionally cutting).
 *
 * Editor contract: section heading carries `data-role="heading"`. Table rows
 * are derived from data — no per-row `data-role`s.
 */

interface UnitTableProps {
  heading?: string;
  units: UnitGroup[];
  /** Where the "Reserve" link points. Receives the unit-group UUID. */
  reserveHrefBase?: string;
  /** Hide the size/dimensions column when the dataset doesn't include real
   * dimensions (e.g. legacy facilities). */
  showDimensions?: boolean;
}

const formatRate = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

export function UnitTable({
  heading = "Available units",
  units,
  reserveHrefBase = "/reserve",
  showDimensions = true,
}: UnitTableProps) {
  return (
    <section data-nocms-component="unit-table" className="py-12 lg:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2
          data-role="heading"
          className="font-heading text-2xl sm:text-3xl font-bold text-text mb-6"
        >
          {heading}
        </h2>
        {units.length === 0 ? (
          <p className="text-zinc-600">
            No units currently available. Please check back soon.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-zinc-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-text">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Size
                  </th>
                  {showDimensions && (
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Dimensions
                    </th>
                  )}
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Type
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Price
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {units.map((u) => {
                  const sqft = u.unitGroupDepth * u.unitGroupWidth;
                  const showStrike =
                    typeof u.currentStreetRate === "number" &&
                    u.currentStreetRate > u.currentWebRate;
                  const soldOut = u.availableUnitCount <= 0;
                  return (
                    <tr
                      key={u.unitGroupUuid}
                      className="border-t border-zinc-200 hover:bg-zinc-50/60"
                    >
                      <td className="px-4 py-3 font-medium">{sqft} sq ft</td>
                      {showDimensions && (
                        <td className="px-4 py-3 text-zinc-600">
                          {u.unitGroupDepth}&apos; &times; {u.unitGroupWidth}&apos;
                        </td>
                      )}
                      <td className="px-4 py-3 text-zinc-600">
                        {u.unitType}
                        {u.description ? ` — ${u.description}` : ""}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold">
                          {formatRate(u.currentWebRate)}
                        </span>
                        <span className="text-zinc-500"> /mo</span>
                        {showStrike && (
                          <span className="ml-2 text-xs text-zinc-400 line-through">
                            {formatRate(u.currentStreetRate as number)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {soldOut ? (
                          <span className="text-zinc-400">Sold out</span>
                        ) : (
                          <a
                            href={`${reserveHrefBase}/${u.unitGroupUuid}`}
                            className="inline-block bg-primary text-white px-3 py-2 rounded-md font-semibold text-xs hover:opacity-90"
                          >
                            Reserve
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
