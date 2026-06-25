import * as React from "react";
import { MapPin } from "lucide-react";
import { Address } from "@/components/facility/Address";
import { RichText } from "@/components/ui/RichText";
import type { Facility } from "@/types/Facility";

/**
 * Facility map sidebar. Source: storage-theme-payload `src/components/FacilityMapSidebar`
 * (Layout-2; the only variant the source actually shipped). The original
 * embedded a Google HybridMap with custom pins + info windows pulled from
 * `@googlemaps/*`. We don't ship Google Maps in the template — instead this
 * component renders the heading, optional Markdown body, and a static
 * map-placeholder block above a directions link. Consumers can later swap
 * the placeholder for a real map without changing the surrounding layout.
 *
 * TODO: integrate a map renderer when the editor adopts a Maps story —
 * either a static Mapbox tile or a deferred Google Maps loader.
 *
 * Editor contract: root tagged `data-nocms-component="facility-map-sidebar"`.
 * Heading carries `data-role="heading"`; the directions link carries `cta`.
 */

interface FacilityMapSidebarProps {
  facility: Pick<Facility, "name" | "address" | "coords">;
  heading?: string;
  /** Markdown body shown under the heading (e.g. parking notes). */
  content?: string;
  hideHeading?: boolean;
  className?: string;
}

export function FacilityMapSidebar({
  facility,
  heading = "Find Us",
  content,
  hideHeading = false,
  className = "",
}: FacilityMapSidebarProps) {
  const { name, address, coords } = facility;
  const mapsQuery = encodeURIComponent(
    coords
      ? `${coords.lat},${coords.lng}`
      : `${name}, ${address.line1}, ${address.city}, ${address.state} ${address.zip}`,
  );
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`;

  return (
    <aside
      data-nocms-component="facility-map-sidebar"
      className={`flex flex-col gap-4 rounded-xl border border-text/10 bg-background p-6 shadow-sm ${className}`}
      aria-label={`Map and directions for ${name}`}
    >
      {!hideHeading && (
        <h2
          data-role="heading"
          className="font-heading text-2xl font-semibold text-text"
        >
          {heading}
        </h2>
      )}

      {content && (
        <div className="text-sm text-muted">
          <RichText source={content} />
        </div>
      )}

      <div
        className="relative flex h-48 items-center justify-center overflow-hidden rounded-lg bg-text/5"
        aria-hidden="true"
      >
        <MapPin className="h-10 w-10 text-text/40" />
      </div>

      <div className="text-sm text-text">
        <Address
          address1={address.line1}
          address2={address.line2 ?? undefined}
          city={address.city}
          state={address.state}
          zip={address.zip}
          size="sm"
        />
      </div>

      <a
        href={directionsHref}
        target="_blank"
        rel="noopener noreferrer"
        data-role="cta"
        className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
      >
        Get directions
      </a>
    </aside>
  );
}

export type { FacilityMapSidebarProps };
export default FacilityMapSidebar;
