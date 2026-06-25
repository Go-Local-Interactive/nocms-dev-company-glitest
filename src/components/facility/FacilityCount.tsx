"use client";

import * as React from "react";

/**
 * Facility count display. Source: storage-theme-payload `src/components/FacilityCount`
 * — strips the legacy MarketFilters event-bus integration (no client-side
 * filtering in this template). Renders a static "Found N Facilities" line;
 * if `count` is omitted the consumer can pass its own header copy via
 * `children`.
 *
 * Editor contract: root tagged `data-nocms-component="facility-count"`. The
 * sentence carries `data-role="heading"`.
 */

interface FacilityCountProps {
  count: number;
  locationName?: string;
  /** Heading text shown after the count (e.g. "Facilities in California"). */
  heading?: string;
  className?: string;
}

export function FacilityCount({
  count,
  locationName = "this area",
  heading,
  className = "",
}: FacilityCountProps) {
  const label =
    heading ??
    `${count === 1 ? "Facility" : "Facilities"} in ${locationName}`;
  return (
    <div
      data-nocms-component="facility-count"
      className={`text-xl font-bold text-text ${className}`}
    >
      <span aria-hidden="true">{count}&nbsp;</span>
      <span data-role="heading">{label}</span>
    </div>
  );
}

export type { FacilityCountProps };
export default FacilityCount;
