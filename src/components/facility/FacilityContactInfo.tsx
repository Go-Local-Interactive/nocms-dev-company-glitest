import * as React from "react";
import { Address } from "@/components/facility/Address";
import type { Facility } from "@/types/Facility";

/**
 * Contact info block for a facility page header. Source: storage-theme-payload
 * `src/components/FacilityContactInfo` (Layout-2). The original wrapped the
 * Google-Places review aggregate and a Maps deep-link icon-link; we drop both
 * (no Google Place data in this template) and keep the canonical structure:
 * one-line address (linkified to Maps via the city/state) + phone + optional
 * review jump.
 *
 * Editor contract: root tagged `data-nocms-component="facility-contact-info"`.
 * The phone is the heading-equivalent leaf; address rides the Address shim.
 */

interface FacilityContactInfoProps {
  facility: Pick<Facility, "name" | "address" | "phone">;
  /** Anchor target for the reviews jump link. Set null/undefined to hide. */
  reviewsHref?: string | null;
  className?: string;
}

export function FacilityContactInfo({
  facility,
  reviewsHref,
  className = "",
}: FacilityContactInfoProps) {
  const { address, phone, name } = facility;
  const mapsQuery = encodeURIComponent(
    `${name}, ${address.line1}, ${address.city}, ${address.state} ${address.zip}`,
  );
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <div
      data-nocms-component="facility-contact-info"
      className={`flex flex-wrap items-center gap-x-6 gap-y-2 text-sm ${className}`}
    >
      <a
        href={mapsHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-link underline decoration-current transition-colors hover:text-link-hover"
        aria-label={`Get directions to ${name}`}
      >
        <Address
          address1={address.line1}
          address2={address.line2 ?? undefined}
          city={address.city}
          state={address.state}
          zip={address.zip}
          size="sm"
          variant="link"
        />
      </a>

      {phone && (
        <a
          href={`tel:${phone.replace(/[^\d+]/g, "")}`}
          data-role="heading"
          className="font-semibold text-text hover:text-link"
        >
          {phone}
        </a>
      )}

      {reviewsHref && (
        <a
          href={reviewsHref}
          data-role="cta"
          className="inline-flex items-center gap-1 text-link underline decoration-current hover:text-link-hover"
        >
          Reviews
        </a>
      )}
    </div>
  );
}

export type { FacilityContactInfoProps };
export default FacilityContactInfo;
