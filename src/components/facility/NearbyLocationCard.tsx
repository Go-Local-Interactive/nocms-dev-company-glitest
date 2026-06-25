import * as React from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Address } from "@/components/facility/Address";
import type { Facility } from "@/types/Facility";

/**
 * Compact "nearby" facility card. Source: storage-theme-payload
 * `src/components/NearbyLocationCard` — strips Payload typed props, the
 * Google-Places review aggregate, the directions deep-link, and the
 * Storage-Essentials live data layer. Renders the canonical structure:
 * image with optional distance pill, centered title + address + phone +
 * primary CTA. Distance is now a plain `distanceMiles` prop the consumer
 * computes (the upstream haversine util can ship in a follow-up). The CTA
 * links `/{slug}` — pass facilities whose `slug` is the FULL (possibly
 * nested) location path, not the flat FMS index slug.
 *
 * Editor contract: root tagged `data-nocms-component="nearby-location-card"`.
 * Title is the heading, distance pill copy is the subheading, the action
 * link carries `data-role="cta"`.
 */

interface NearbyLocationCardProps {
  facility: Pick<Facility, "slug" | "name" | "address" | "phone">;
  index?: number;
  distanceMiles?: number | null;
  imageSrc?: string | null;
  imageAlt?: string;
  ctaLabel?: string;
  className?: string;
}

export function NearbyLocationCard({
  facility,
  index,
  distanceMiles,
  imageSrc,
  imageAlt,
  ctaLabel = "See Units",
  className = "",
}: NearbyLocationCardProps) {
  const href = `/${facility.slug}`;
  const distanceText =
    distanceMiles != null ? `${distanceMiles.toFixed(2)} Miles Away` : null;
  const titleId = `nearby-location-card-${facility.slug}-title`;

  return (
    <article
      data-nocms-component="nearby-location-card"
      className={`flex flex-col overflow-hidden rounded-xl border border-text/10 bg-background shadow-sm transition-shadow hover:shadow-md ${className}`}
      aria-labelledby={titleId}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-text/5">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={imageAlt ?? `${facility.name} exterior`}
            loading="lazy"
            className="h-full w-full object-cover" data-role="media"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center text-text/30 text-sm"
          >
            No photo yet
          </div>
        )}
        {distanceText && (
          <span
            data-role="subheading"
            className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-background/95 px-3 py-1 text-xs font-semibold text-text shadow"
            aria-label={distanceText}
          >
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {typeof index === "number" && (
              <>
                <span>{index + 1}</span>
                <span aria-hidden="true" className="h-3 w-px bg-text/30" />
              </>
            )}
            {distanceText}
          </span>
        )}
      </div>

      <div className="flex flex-col items-center gap-3 p-6 text-center">
        <h3
          id={titleId}
          data-role="heading"
          className="font-heading text-lg font-semibold text-text"
        >
          {facility.name}
        </h3>

        <Address
          address1={facility.address.line1}
          address2={facility.address.line2 ?? undefined}
          city={facility.address.city}
          state={facility.address.state}
          zip={facility.address.zip}
          size="sm"
          className="text-muted"
        />

        {facility.phone && (
          <a
            href={`tel:${facility.phone.replace(/[^\d+]/g, "")}`}
            className="text-sm font-medium text-link hover:underline"
          >
            {facility.phone}
          </a>
        )}

        <Link
          href={href}
          data-role="cta"
          className="mt-2 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
          aria-label={`See units at ${facility.name}`}
        >
          {ctaLabel}
        </Link>
      </div>
    </article>
  );
}

export type { NearbyLocationCardProps };
export default NearbyLocationCard;
