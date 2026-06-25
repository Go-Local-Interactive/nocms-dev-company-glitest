import * as React from "react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FacilityCards } from "@/components/facility/FacilityCards";
import { LexicalRichText } from "@/lib/lexical-to-html";
import { payloadDocAttrs, payloadFieldAttrs } from "@/lib/payload-attrs";
import { listFacilities } from "@/lib/facilities/loader";
import {
  ancestorCrumbs,
  directChildren,
  cardImageUrl,
  fmsJoinKey,
  locationHref,
  toCardFacility,
} from "@/lib/locations";
import type { PayloadLocation } from "@/lib/payload";

/**
 * City hub page (a `locations` doc with `locationType: "city"`), served at
 * its full legacy path by the root catch-all. Child `single` facilities are
 * derived from slug prefixes (one segment below `{citySlug}/`) and render as
 * facility cards — FMS-enriched when the static loader has a record for
 * `fmsJoinKey`, editorial-only otherwise. Cards link to `/{slug}`; breadcrumb
 * ancestors (e.g. the state) get their titles from the fetched location list.
 * Both the hero facility count and the card grid use direct children only
 * (depth+1) — deeper nesting under a city would not be counted (matches the
 * current data model).
 *
 * Editor contract: root tagged `data-nocms-component="city-hub"` with
 * `data-payload-*` doc attrs; title/description carry field attrs.
 */

interface CityHubProps {
  location: PayloadLocation;
  /** Full location list — children and breadcrumb titles derive from it. */
  allLocations: PayloadLocation[];
  /** Tenant's all-locations index slug — the breadcrumb root links it. */
  locationsIndexSlug?: string;
}

export async function CityHub({ location, allLocations, locationsIndexSlug }: CityHubProps) {
  const singles = directChildren(location, allLocations)
    .filter((l) => l.locationType === "single")
    .sort((a, b) => a.title.localeCompare(b.title));

  const fmsByKey = new Map((await listFacilities()).map((f) => [f.slug, f]));
  const facilityCards = singles.map((s) => toCardFacility(s, fmsByKey.get(fmsJoinKey(s))));
  const images = Object.fromEntries(
    singles.flatMap((s) => {
      const u = cardImageUrl(s);
      return u ? [[s.slug, u]] : [];
    }),
  );

  return (
    <div
      data-nocms-component="city-hub"
      {...payloadDocAttrs({ collection: "locations", docId: location.id })}
    >
      <section className="bg-surface py-10 lg:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Locations", href: locationsIndexSlug ? `/${locationsIndexSlug}` : undefined },
              ...ancestorCrumbs(location, allLocations, locationsIndexSlug),
              { label: location.title },
            ]}
            className="mb-6"
          />
          <h1
            data-role="heading"
            {...payloadFieldAttrs({ collection: "locations", docId: location.id, field: "title" })}
            className="font-heading text-4xl lg:text-5xl font-bold text-text leading-tight"
          >
            {location.title}
          </h1>
          <p data-role="subheading" className="mt-3 text-lg text-muted">
            {facilityCards.length} {facilityCards.length === 1 ? "facility" : "facilities"}
          </p>
        </div>
      </section>

      {location.description && (
        <section className="py-10 lg:py-14 bg-background">
          <div
            className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8"
            {...payloadFieldAttrs({ collection: "locations", docId: location.id, field: "description" })}
          >
            <LexicalRichText
              value={location.description}
              className="text-text leading-relaxed prose prose-lg max-w-none"
            />
          </div>
        </section>
      )}

      <section className="py-12 lg:py-16 bg-surface">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {facilityCards.length === 0 ? (
            <p className="text-muted" data-role="text">
              No facilities published in {location.title} yet.
            </p>
          ) : (
            <FacilityCards
              facilities={facilityCards}
              heading={`Facilities in ${location.title}`}
              hrefFor={locationHref}
              images={images}
            />
          )}
        </div>
      </section>
    </div>
  );
}
