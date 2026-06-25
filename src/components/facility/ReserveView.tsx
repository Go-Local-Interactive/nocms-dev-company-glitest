import { ReservationForm } from "@/components/storage/ReservationForm";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import type { Facility } from "@/types/Facility";

/**
 * Reservation rendering for a single facility's unit group, moved out of the
 * retired `src/app/storage-locations/[slug]/reserve/[unitGroupUuid]` route so
 * the root catch-all (`src/app/[...slug]`) renders it at
 * `/{locationSlug}/reserve/{unitGroupUuid}`. The caller resolves the Payload
 * location, joins FMS data (`getFacility(fmsJoinKey(loc))`), and renders
 * `ReservePlaceholder` for the build-time `_placeholder` unit-group param.
 *
 * Editor contract: header tagged `data-nocms-component="reserve-header"`, the
 * placeholder `data-nocms-component="reserve-placeholder"`, with
 * heading/subheading roles — preserved verbatim from the route.
 */

interface ReserveViewProps {
  facility: Facility;
  /** Full (possibly nested) location slug — all hrefs hang off `/{locationSlug}`. */
  locationSlug: string;
  unitGroupUuid: string;
  /** Tenant's all-locations index slug — the breadcrumb root links it. */
  locationsIndexSlug?: string;
}

/** Build-time stand-in: real unit-group uuids aren't enumerable yet, so the
 *  static export emits one `reserve/_placeholder` route per facility. */
export function ReservePlaceholder() {
  return (
    <section
      data-nocms-component="reserve-placeholder"
      className="mx-auto max-w-2xl px-6 py-16"
    >
      <h1
        data-role="heading"
        className="font-heading text-3xl font-bold text-text"
      >
        Start your reservation
      </h1>
      <p data-role="subheading" className="mt-4 text-muted">
        Pick a unit on a location&apos;s available-units page to begin.
      </p>
    </section>
  );
}

export function ReserveView({ facility, locationSlug, unitGroupUuid, locationsIndexSlug }: ReserveViewProps) {
  return (
    <>
      <section
        data-nocms-component="reserve-header"
        className="bg-surface py-10 lg:py-12"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Locations", href: locationsIndexSlug ? `/${locationsIndexSlug}` : undefined },
              { label: facility.name, href: `/${locationSlug}` },
              { label: "Available units", href: `/${locationSlug}/unit-groups` },
              { label: "Reserve" },
            ]}
            className="mb-6"
          />
          <h1
            data-role="heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-text"
          >
            Reserve your unit
          </h1>
          <p data-role="subheading" className="mt-2 text-muted">
            At <strong>{facility.name}</strong> ({facility.address.city},{" "}
            {facility.address.state}). No payment due now — we&apos;ll hold the unit while you
            finish move-in.
          </p>
        </div>
      </section>

      <section className="py-10 lg:py-14 bg-background">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <ReservationForm
            facilityUuid={facility.id}
            unitGroupUuid={unitGroupUuid}
          />
        </div>
      </section>
    </>
  );
}

export type { ReserveViewProps };
