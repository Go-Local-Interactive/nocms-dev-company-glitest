import * as React from "react";
import Link from "next/link";
import { Address } from "@/components/facility/Address";
import type { Facility, FacilityIndexEntry } from "@/types/Facility";

/**
 * Facility card. Source: storage-theme-payload `src/components/FacilityCard`
 * — strips the Payload-typed `Tenant`/`Facility`, the Storage-Essentials live
 * data layer, the Google-Places review aggregate, and the embedded map pin.
 * What remains is the visual structure: image header, title, address line,
 * phone, and a primary CTA. Accepts either the slim `FacilityIndexEntry`
 * (used on the locations index) or the full `Facility` (used on detail
 * landing pages where the address + phone come along for free).
 *
 * Editor contract: root tagged `data-nocms-component="facility-card"`. The
 * facility name is the heading, the city/state line acts as the subheading,
 * and the action link carries `data-role="cta"`.
 */

type CardFacility =
  | FacilityIndexEntry
  | (Pick<Facility, "slug" | "name" | "address" | "phone"> & Partial<FacilityIndexEntry>);

interface FacilityCardProps {
  facility: CardFacility;
  index?: number;
  imageSrc?: string | null;
  imageAlt?: string;
  ctaLabel?: string;
  /** CTA destination. Defaults to `/{slug}` — callers must pass facilities
   *  whose `slug` is the FULL (possibly nested) location path, not the flat
   *  FMS index slug (see `toCardFacility` in `src/lib/locations.ts`). */
  href?: string;
  className?: string;
}

function isFullFacility(f: CardFacility): f is Facility {
  return "address" in f && typeof (f as Facility).address?.line1 === "string";
}

export function FacilityCard({
  facility,
  index,
  imageSrc,
  imageAlt,
  ctaLabel = "View available units",
  href: hrefProp,
  className = "",
}: FacilityCardProps) {
  const href = hrefProp ?? `/${facility.slug}`;
  const cityState =
    "city" in facility && "state" in facility
      ? `${facility.city}, ${facility.state}`
      : "";
  const full = isFullFacility(facility);

  return (
    <article
      data-nocms-component="facility-card"
      className={`group flex h-full flex-col overflow-hidden rounded-xl border border-text/10 bg-background shadow-sm transition-shadow hover:shadow-lg ${className}`}
      aria-labelledby={`facility-card-${facility.slug}-title`}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-text/5">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={imageAlt ?? `${facility.name} exterior`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center text-text/30 text-sm"
          >
            No photo yet
          </div>
        )}
        {typeof index === "number" && (
          <span className="absolute left-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white shadow">
            {index + 1}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <h3
          id={`facility-card-${facility.slug}-title`}
          data-role="heading"
          className="font-heading text-xl font-semibold leading-tight text-text"
        >
          {facility.name}
        </h3>

        <div className="text-sm text-muted">
          {full ? (
            <Address
              address1={facility.address.line1}
              address2={facility.address.line2 ?? undefined}
              city={facility.address.city}
              state={facility.address.state}
              zip={facility.address.zip}
              size="sm"
            />
          ) : cityState ? (
            <p data-role="subheading" className="not-italic">
              {cityState}
            </p>
          ) : null}
          {full && facility.phone && (
            <a
              href={`tel:${facility.phone.replace(/[^\d+]/g, "")}`}
              className="mt-2 inline-block text-link hover:underline"
            >
              {facility.phone}
            </a>
          )}
        </div>

        <div className="mt-auto pt-2">
          <Link
            href={href}
            data-role="cta"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {ctaLabel}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export type { FacilityCardProps, CardFacility };
export default FacilityCard;
