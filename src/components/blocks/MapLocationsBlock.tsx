import * as React from "react";
import { ChevronDown, MapPin } from "lucide-react";
import type { BlockProps } from "./types";
import { fetchLocations, fetchTenantMapKey, type PayloadLocation } from "@/lib/payload";
import { descendantSingles, locationHref } from "@/lib/locations";
import { LocationsMap, type MapMarker } from "../content/LocationsMap";

/**
 * `map-locations` — ports legacy `storage-theme-payload` MapLocationsAccordion
 * ("Locate the Nearest Storage Available in your Area"): a centred heading +
 * search bar, then a two-column row with a Google Map (≈⅔, brand-coloured
 * numbered pins) and a lavender state→city accordion (≈⅓, "States With Our
 * Storage"). The map renders only when the tenant carries a browser Maps key
 * (legacy `googleApiBrowserKey`); otherwise the column shows a list fallback.
 */

interface CityEntry {
  name: string;
  href: string;
  count: number;
}
interface StateGroup {
  state: string;
  cities: CityEntry[];
}

/** Group `city` hubs under their `state` hub, counting facilities (`single`
 *  descendants) per city — mirrors legacy's state→city accordion. Falls back to
 *  grouping cities by their `state` field when the state-hub layer is absent. */
function buildStateGroups(all: PayloadLocation[]): StateGroup[] {
  const states = all.filter((l) => l.locationType === "state");
  const cities = all.filter((l) => l.locationType === "city");

  const cityEntry = (c: PayloadLocation): CityEntry => ({
    name: c.title,
    href: locationHref(c),
    count: descendantSingles(c, all).length,
  });
  const sortCities = (a: CityEntry, b: CityEntry) => a.name.localeCompare(b.name);

  const groups: StateGroup[] = states
    .map((state) => ({
      state: state.title,
      cities: cities
        .filter((c) => c.slug.startsWith(`${state.slug}/`))
        .map(cityEntry)
        .filter((c) => c.count > 0)
        .sort(sortCities),
    }))
    .filter((g) => g.cities.length > 0);

  if (groups.length > 0) {
    return groups.sort((a, b) => a.state.localeCompare(b.state));
  }

  // Fallback: no state-hub layer — bucket cities by their `state` field.
  const byState = new Map<string, CityEntry[]>();
  for (const c of cities) {
    const entry = cityEntry(c);
    if (entry.count === 0) continue;
    const key = c.state || "Other";
    byState.set(key, [...(byState.get(key) ?? []), entry]);
  }
  return Array.from(byState.entries())
    .map(([state, list]) => ({ state, cities: list.sort(sortCities) }))
    .sort((a, b) => a.state.localeCompare(b.state));
}

/** Brand-coloured numbered markers from every `single` with geo (GeoJSON
 *  `coordinates` are `[lng, lat]`). */
function buildMarkers(all: PayloadLocation[]): MapMarker[] {
  return all
    .filter(
      (l): l is PayloadLocation & { coordinates: [number, number] } =>
        l.locationType === "single" && Array.isArray(l.coordinates),
    )
    .map((l, i) => ({
      lat: l.coordinates[1],
      lng: l.coordinates[0],
      title: l.title,
      href: locationHref(l),
      label: String(i + 1),
    }));
}

/** Pure presentational view — data-free so it can be rendered with fixtures. */
export function MapLocationsView({
  title,
  groups,
  markers,
  apiKey,
  accordionHeading = "States With Our Storage",
}: {
  title?: string;
  groups: StateGroup[];
  markers: MapMarker[];
  apiKey: string | null;
  accordionHeading?: string;
}) {
  const hasAccordion = groups.length > 0;

  return (
    <section
      data-nocms-component="map-locations"
      className="bg-background py-12 px-6 sm:px-10 lg:px-16"
    >
      {/* Content capped + centred to the same container as sibling home
          sections (legacy `container-main`) so the L/R edges line up. */}
      <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-10">
      {/* Intro: centred heading + slim search bar (legacy `.mla-container`). */}
      <div className="flex flex-col items-center text-center gap-8 md:gap-10">
        {title && (
          <h2
            data-role="heading"
            data-payload-subfield="title"
            className="font-heading text-2xl md:text-4xl font-bold text-text max-w-3xl"
          >
            {title}
          </h2>
        )}
        <form
          action="/search"
          method="get"
          role="search"
          className="w-full max-w-full md:max-w-[80%] xl:max-w-[60%] flex items-stretch gap-1"
        >
          <label htmlFor="map-locations-search" className="sr-only" data-role="text">
            Zip or City, State
          </label>
          <input
            id="map-locations-search"
            type="search"
            name="q"
            placeholder="Zip or City, State"
            className="flex-1 min-w-0 bg-black/[0.06] border-0 rounded-l-full px-6 py-3 text-text placeholder:text-text/70 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="submit"
            className="shrink-0 inline-flex items-center justify-center bg-primary text-white text-lg font-bold px-6 md:min-w-40 rounded-r-full hover:opacity-90 transition" data-role="cta"
          >
            Search
          </button>
        </form>
      </div>

      {/* Content row: map (≈⅔) + accordion (≈⅓). On mobile the accordion is
          first (legacy `order-1`); the map drops below it. */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div
          className={`order-2 xl:order-1 h-[400px] ${
            hasAccordion ? "xl:col-span-8" : "xl:col-span-12"
          }`}
        >
          {apiKey ? (
            <LocationsMap apiKey={apiKey} markers={markers} />
          ) : (
            <div className="h-full w-full rounded-lg bg-surface border border-text/5 flex items-center justify-center text-muted">
              <span className="flex items-center gap-2" data-role="text-2">
                <MapPin className="h-5 w-5" /> Map view
              </span>
            </div>
          )}
        </div>

        {hasAccordion && (
          <div className="order-1 xl:order-2 xl:col-span-4 flex flex-col overflow-hidden rounded-lg bg-primary-light p-4 xl:h-[400px]">
            <h3 className="shrink-0 text-center pt-1 pb-3 text-[22px] xl:text-2xl font-bold text-text" data-role="heading-2">
              {accordionHeading}
            </h3>
            <div className="min-h-0 flex-1 max-h-[22rem] overflow-y-auto xl:max-h-none">
              <div className="flex flex-col gap-4 pr-1">
                {groups.map((group) => (
                  <details key={group.state} name="map-locations-states" className="group">
                    <summary className="flex items-center justify-between gap-4 px-6 py-3 bg-white rounded-md group-open:rounded-b-none cursor-pointer list-none [&::-webkit-details-marker]:hidden font-bold text-base text-text outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                      <span>{group.state}</span>
                      <ChevronDown
                        className="h-4 w-4 shrink-0 text-primary transition-transform duration-200 group-open:rotate-180"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </summary>
                    <ul className="flex flex-col bg-white rounded-b-lg overflow-hidden">
                      {group.cities.map((city) => (
                        <li key={city.href + city.name} className="text-base">
                          <a
                            href={city.href}
                            className="flex items-center px-6 py-3 text-text [&:hover_.city]:text-primary"
                            aria-label={`View ${city.count} ${
                              city.count === 1 ? "facility" : "facilities"
                            } in ${city.name}`}
                          >
                            <span className="city flex-1">{city.name}</span>
                            <span className="flex-1 text-right font-bold" aria-hidden="true">
                              <span className="bg-primary-light px-2 py-1 rounded-lg">
                                {city.count}
                              </span>
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </section>
  );
}

export async function MapLocationsBlock({ title }: BlockProps) {
  const [locations, apiKey] = await Promise.all([fetchLocations(300), fetchTenantMapKey()]);
  return (
    <MapLocationsView
      title={title ?? undefined}
      groups={buildStateGroups(locations)}
      markers={buildMarkers(locations)}
      apiKey={apiKey}
    />
  );
}
