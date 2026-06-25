import * as React from "react";
import { FacilityHours } from "@/components/facility/FacilityHours";
import { FacilityFeatures } from "@/components/facility/FacilityFeatures";
import { FacilityContactInfo } from "@/components/facility/FacilityContactInfo";
import { FacilityGallery } from "@/components/facility/FacilityGallery";
import { CTABanner } from "@/components/content/CTABanner";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LexicalRichText } from "@/lib/lexical-to-html";
import { payloadDocAttrs, payloadFieldAttrs } from "@/lib/payload-attrs";
import type { PayloadLocation } from "@/lib/payload";
import type { Facility } from "@/types/Facility";

/**
 * Single-location (facility) detail rendering for the root catch-all
 * (`src/app/[...slug]`), originally extracted from the retired
 * `/storage-locations/[slug]` route. Payload editorial
 * (title, description, SEO) and FMS operational data (hours, address,
 * amenities) are joined by the caller; either may be null, but callers must
 * `notFound()` when both are.
 *
 * Editor contract: header tagged `data-nocms-component="facility-header"`
 * with `data-payload-*` doc/field attrs — preserved verbatim from the route.
 */

const SAMPLE_GALLERY = [
  { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80", alt: "Storage facility exterior" },
  { src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80", alt: "Storage unit interior" },
  { src: "https://images.unsplash.com/photo-1594819047050-99defe213a55?w=1200&q=80", alt: "Drive-up storage units" },
];

interface FacilityDetailProps {
  editorial: PayloadLocation | null;
  facility: Facility | null;
  /** Href for the "See available units" CTA. Shown only when `facility` exists. */
  unitGroupsHref: string;
  /** Tenant's all-locations index slug — the breadcrumb root links it. */
  locationsIndexSlug?: string;
}

export function FacilityDetail({ editorial, facility, unitGroupsHref, locationsIndexSlug }: FacilityDetailProps) {
  const name = editorial?.title ?? facility?.name ?? "Location";
  const subheading = facility
    ? `${facility.address.city}, ${facility.address.state}`
    : [editorial?.city, editorial?.state].filter(Boolean).join(", ");
  const features = facility?.amenities.map((feat) => ({ name: feat })) ?? [];

  return (
    <>
      <section
        data-nocms-component="facility-header"
        {...(editorial && payloadDocAttrs({ collection: "locations", docId: editorial.id }))}
        className="bg-surface py-10 lg:py-14"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Locations", href: locationsIndexSlug ? `/${locationsIndexSlug}` : undefined },
              { label: name },
            ]}
            className="mb-6"
          />
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h1
                data-role="heading"
                {...(editorial && payloadFieldAttrs({ collection: "locations", docId: editorial.id, field: "title" }))}
                className="font-heading text-4xl lg:text-5xl font-bold text-text leading-tight"
              >
                {name}
              </h1>
              {subheading && (
                <p data-role="subheading" className="mt-3 text-lg text-muted">
                  {subheading}
                </p>
              )}
            </div>
            {facility && (
              <a
                href={unitGroupsHref}
                data-role="cta"
                className="inline-flex items-center justify-center bg-primary text-white font-semibold px-6 py-3 rounded-md shadow-md hover:opacity-90 transition-opacity"
              >
                See available units
              </a>
            )}
          </div>
          {facility && (
            <div className="mt-6">
              <FacilityContactInfo facility={facility} />
            </div>
          )}
        </div>
      </section>

      {editorial?.description && (
        <section className="py-12 lg:py-16 bg-background">
          <div
            className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8"
            {...payloadFieldAttrs({ collection: "locations", docId: editorial.id, field: "description" })}
          >
            <LexicalRichText
              value={editorial.description}
              className="text-text leading-relaxed prose prose-lg max-w-none"
            />
          </div>
        </section>
      )}

      {facility && (
        <>
          <section className="py-12 lg:py-16 bg-background">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <FacilityGallery
                images={SAMPLE_GALLERY}
                facilityName={name}
                heading="Inside the facility"
              />
            </div>
          </section>

          <section className="py-12 lg:py-16 bg-surface">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                  {features.length > 0 && (
                    <FacilityFeatures
                      features={features}
                      content={"## Facility features"}
                    />
                  )}
                </div>
                <div>
                  <FacilityHours hours={facility.hours} />
                </div>
              </div>
            </div>
          </section>

          <CTABanner
            heading={`Reserve a unit at ${name}`}
            subheading="Lock in today's rate online — no payment due now."
            primaryCta={{ label: "See available units", href: unitGroupsHref }}
            phone={facility.phone ?? undefined}
          />
        </>
      )}
    </>
  );
}
