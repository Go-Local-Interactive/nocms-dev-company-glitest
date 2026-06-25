import * as React from "react";
import { AppLink } from "@/components/ui/AppLink";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FacilityCards } from "@/components/facility/FacilityCards";
import { LexicalRichText } from "@/lib/lexical-to-html";
import { payloadDocAttrs, payloadFieldAttrs } from "@/lib/payload-attrs";
import { listFacilities } from "@/lib/facilities/loader";
import {
  ancestorCrumbs,
  descendantSingles,
  directChildren,
  cardImageUrl,
  fmsJoinKey,
  locationHref,
  toCardFacility,
} from "@/lib/locations";
import type { PayloadLocation } from "@/lib/payload";

/**
 * State hub page (a `locations` doc with `locationType: "state"`), served at
 * its full legacy path by the root catch-all. Children are derived from slug
 * prefixes: city hubs one segment below get count cards; `single` facilities
 * directly under the state get full facility cards (FMS-enriched where the
 * static loader has a record for `fmsJoinKey`). All links go to `/{slug}` —
 * the legacy-parity path.
 *
 * Editor contract: root tagged `data-nocms-component="state-hub"` with
 * `data-payload-*` doc attrs; title/description carry field attrs.
 */

interface StateHubProps {
  location: PayloadLocation;
  /** Full location list — children and breadcrumb titles derive from it. */
  allLocations: PayloadLocation[];
  /** Tenant's all-locations index slug — the breadcrumb root links it. */
  locationsIndexSlug?: string;
}

export async function StateHub({ location, allLocations, locationsIndexSlug }: StateHubProps) {
  const children = directChildren(location, allLocations);
  const cities = children
    .filter((l) => l.locationType === "city")
    .sort((a, b) => a.title.localeCompare(b.title));
  const singles = children
    .filter((l) => l.locationType === "single")
    .sort((a, b) => a.title.localeCompare(b.title));
  const totalFacilities = descendantSingles(location, allLocations).length;

  const fmsByKey = new Map((await listFacilities()).map((f) => [f.slug, f]));
  const facilityCards = singles.map((s) => toCardFacility(s, fmsByKey.get(fmsJoinKey(s))));
  const images = Object.fromEntries(
    singles.flatMap((s) => {
      const u = cardImageUrl(s);
      return u ? [[s.slug, u]] : [];
    }),
  );

  const countParts = [
    cities.length > 0 && `${cities.length} ${cities.length === 1 ? "city" : "cities"}`,
    totalFacilities > 0 &&
      `${totalFacilities} ${totalFacilities === 1 ? "facility" : "facilities"}`,
  ].filter(Boolean);

  return (
    <div
      data-nocms-component="state-hub"
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
          {countParts.length > 0 && (
            <p data-role="subheading" className="mt-3 text-lg text-muted">
              {countParts.join(" · ")}
            </p>
          )}
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

      {cities.length > 0 && (
        <section className="py-12 lg:py-16 bg-surface">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2
              data-role="heading-2"
              className="font-heading text-2xl sm:text-3xl font-bold text-text mb-6"
            >
              Cities in {location.title}
            </h2>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cities.map((city) => {
                const facilityCount = descendantSingles(city, allLocations).length;
                return (
                  <li key={city.id}>
                    <AppLink
                      href={locationHref(city)}
                      data-role="cta"
                      className="group flex items-center justify-between gap-3 rounded-xl border border-text/10 bg-background px-5 py-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <span className="font-heading text-lg font-semibold text-text">
                        {city.title}
                      </span>
                      {facilityCount > 0 && (
                        <span className="shrink-0 text-sm text-muted">
                          {facilityCount} {facilityCount === 1 ? "facility" : "facilities"}{" "}
                          <span aria-hidden="true" data-role="text-2">&rarr;</span>
                        </span>
                      )}
                    </AppLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {facilityCards.length > 0 && (
        <section className="py-12 lg:py-16 bg-background">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <FacilityCards
              facilities={facilityCards}
              heading={`Facilities in ${location.title}`}
              hrefFor={locationHref}
              images={images}
            />
          </div>
        </section>
      )}

      {children.length === 0 && (
        <section className="py-12 lg:py-16 bg-background">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <p className="text-muted" data-role="text">
              No locations published in {location.title} yet.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
