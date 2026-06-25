import * as React from "react";
import { FacilityCard, type CardFacility } from "@/components/facility/FacilityCard";

/**
 * Grid of FacilityCards. Source: storage-theme-payload `src/components/FacilityCards`
 * — strips the SE/Payload twin-array shape and the live-data promises. Now
 * accepts a single `facilities` prop (FacilityIndexEntry[] from listFacilities()
 * or full Facility[] from a curated lookup).
 *
 * Editor contract: root tagged `data-nocms-component="facility-cards"`.
 * Heading and empty-state copy carry text roles; the cards own their own
 * cta + heading roles.
 */

interface FacilityCardsProps {
  facilities: CardFacility[];
  heading?: string;
  emptyMessage?: string;
  /** Map slug → image URL (optional). */
  images?: Record<string, string>;
  /** Per-card CTA destination. Defaults to FacilityCard's `/{slug}` — card
   *  slugs must be full (possibly nested) location paths. */
  hrefFor?: (facility: CardFacility) => string;
  className?: string;
}

export function FacilityCards({
  facilities,
  heading,
  emptyMessage = "No storage facilities found.",
  images,
  hrefFor,
  className = "",
}: FacilityCardsProps) {
  const count = facilities.length;

  return (
    <section
      data-nocms-component="facility-cards"
      className={`mb-8 ${className}`}
      aria-label={heading ?? "Storage facilities"}
    >
      {heading && (
        <h2
          data-role="heading"
          className="font-heading text-2xl sm:text-3xl font-bold text-text mb-6"
        >
          {heading}
        </h2>
      )}

      {count === 0 ? (
        <div role="status" className="py-8 text-center">
          <p data-role="subheading" className="text-xl text-muted">
            {emptyMessage}
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          aria-label={`${count} storage ${count === 1 ? "facility" : "facilities"}`}
        >
          {facilities.map((facility, index) => (
            <FacilityCard
              key={facility.slug}
              facility={facility}
              index={index}
              imageSrc={images?.[facility.slug] ?? null}
              href={hrefFor?.(facility)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export type { FacilityCardsProps };
export default FacilityCards;
