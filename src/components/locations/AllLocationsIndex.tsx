import * as React from "react";
import { FacilityCards } from "@/components/facility/FacilityCards";
import { CTABanner } from "@/components/content/CTABanner";
import { listFacilities } from "@/lib/facilities/loader";
import { cardImageUrl, fmsJoinKey, locationHref, toCardFacility } from "@/lib/locations";
import type { PayloadLocation } from "@/lib/payload";
import skinConfig from "@/skin.config";

/**
 * All-locations LISTING rendered beneath the migrated landing page's editorial
 * blocks by the root catch-all (when the resolved page's slug matches the
 * tenant's `locationsIndexSlug`). This is the body of the former hardcoded
 * `/storage-locations` index route, with one critical difference: it is
 * EDITORIAL-INCLUSIVE.
 *
 * Every `single` location is listed via `toCardFacility` (FMS-enriched where
 * the static loader has a record for `fmsJoinKey`), NOT `fmsBackedCardFacilities`
 * — that helper drops content-only locations, which is wrong for imported
 * sites that have no FMS credentials and thus no operational data.
 *
 * `allLocations` is passed in by the catch-all (already fetched) so this
 * doesn't re-fetch. Cards link `/{slug}` — the legacy-parity path.
 *
 * Editor contract: hero tagged `data-nocms-component="storage-locations-hero"`
 * with heading/subheading roles; FacilityCards + CTABanner own their own tags.
 */
export async function AllLocationsIndex({
  allLocations,
}: {
  allLocations: PayloadLocation[];
}) {
  const fmsByKey = new Map((await listFacilities()).map((f) => [f.slug, f]));
  const singles = allLocations.filter((l) => l.locationType === "single");
  const facilities = singles.map((l) => toCardFacility(l, fmsByKey.get(fmsJoinKey(l))));
  // Keyed by the nested location slug — the same slug `toCardFacility` sets on
  // each card — so one map covers every FacilityCards group below.
  const images = Object.fromEntries(
    singles.flatMap((s) => {
      const u = cardImageUrl(s);
      return u ? [[s.slug, u]] : [];
    }),
  );

  const states = new Set(facilities.map((f) => f.state));
  const groupByState = facilities.length > 6 && states.size >= 2;

  return (
    <>
      <section
        data-nocms-component="storage-locations-hero"
        className="bg-primary py-16 lg:py-20 text-center text-white"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1
            data-role="heading"
            className="font-heading text-4xl sm:text-5xl font-bold leading-tight"
          >
            Our locations
          </h1>
          <p data-role="subheading" className="mt-4 text-lg text-white/85">
            {facilities.length} {facilities.length === 1 ? "facility" : "facilities"} ready to store your stuff.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {facilities.length === 0 ? (
            <p className="text-center text-muted">
              No locations yet — add one in your CMS to publish it here.
            </p>
          ) : groupByState ? (
            <div className="space-y-12">
              {Array.from(states)
                .sort()
                .map((state) => {
                  const inState = facilities.filter((f) => f.state === state);
                  return (
                    <FacilityCards
                      key={state}
                      heading={state}
                      facilities={inState}
                      hrefFor={locationHref}
                      images={images}
                    />
                  );
                })}
            </div>
          ) : (
            <FacilityCards facilities={facilities} hrefFor={locationHref} images={images} />
          )}
        </div>
      </section>

      <CTABanner
        heading="Don't see a location near you?"
        subheading="Call us — we may have an opening at a nearby facility, or we can recommend partners."
        primaryCta={{ label: "Contact us", href: "/contact" }}
        phone={skinConfig.contactPhone}
      />
    </>
  );
}
