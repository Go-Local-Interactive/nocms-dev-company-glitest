import * as React from "react";

/**
 * Locations grouped by state, rendered as a native <details>/<summary>
 * accordion. Source: storage-theme-payload `src/blocks/MapLocationsAccordion`,
 * with the HybridMap (Google Maps) replaced by a placeholder block — the
 * upstream Google Maps integration ships in a later phase.
 *
 * Editor contract: section heading carries `data-role="heading"`. Individual
 * city links have no roles.
 */

export interface CityLocation {
  cityName: string;
  facilityCount: number;
  cityLink?: string;
}

export interface StateGroup {
  state: string;
  stateAbbreviation?: string;
  cities: CityLocation[];
}

interface MapLocationsAccordionProps {
  heading?: string;
  intro?: string;
  stateGroups?: StateGroup[];
  accordionVisibility?: "always" | "hide-desktop" | "never";
}

// Sample data: city links point at nested city-hub paths (`/{state}/{city}`)
// — location URLs are full legacy paths served by the root catch-all.
const defaultStateGroups: StateGroup[] = [
  {
    state: "Texas",
    stateAbbreviation: "TX",
    cities: [
      { cityName: "Austin", facilityCount: 4, cityLink: "/texas/austin" },
      { cityName: "Dallas", facilityCount: 6, cityLink: "/texas/dallas" },
      { cityName: "Houston", facilityCount: 5, cityLink: "/texas/houston" },
    ],
  },
  {
    state: "Colorado",
    stateAbbreviation: "CO",
    cities: [
      { cityName: "Denver", facilityCount: 3, cityLink: "/colorado/denver" },
      { cityName: "Boulder", facilityCount: 1, cityLink: "/colorado/boulder" },
    ],
  },
];

export function MapLocationsAccordion({
  heading = "Find a location",
  intro,
  stateGroups = defaultStateGroups,
  accordionVisibility = "always",
}: MapLocationsAccordionProps) {
  if (accordionVisibility === "never") return null;

  const accordionClass =
    accordionVisibility === "hide-desktop" ? "lg:hidden" : "";

  return (
    <section
      data-nocms-component="map-locations-accordion"
      className="py-16 lg:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2
            data-role="heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-text"
          >
            {heading}
          </h2>
          {intro && <p className="mt-3 text-muted text-lg" data-role="subheading">{intro}</p>}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* TODO: replace with the Google HybridMap port once GoogleMap utilities land. */}
          <div className="aspect-[4/3] lg:aspect-auto bg-surface rounded-xl border border-text/5 flex items-center justify-center text-muted">
            <span data-role="text">Map view</span>
          </div>

          <div className={accordionClass}>
            <div className="space-y-3">
              {stateGroups.map((group) => (
                <details
                  key={group.state}
                  className="group bg-surface rounded-lg border border-text/5 overflow-hidden"
                >
                  <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden hover:bg-background/50 transition-colors">
                    <span className="font-semibold text-text">{group.state}</span>
                    <svg
                      className="h-5 w-5 text-muted shrink-0 transition-transform duration-200 group-open:rotate-180"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </summary>
                  <ul className="border-t border-text/5">
                    {group.cities.map((city) => (
                      <li
                        key={city.cityName}
                        className="border-b border-text/5 last:border-b-0"
                      >
                        <a
                          href={city.cityLink ?? "#"}
                          className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-background/50 transition-colors"
                          aria-label={`View ${city.facilityCount} ${
                            city.facilityCount === 1 ? "facility" : "facilities"
                          } in ${city.cityName}`}
                        >
                          <span className="text-text">{city.cityName}</span>
                          <span className="inline-flex items-center justify-center min-w-[2rem] h-6 px-2 rounded-full bg-primary-light text-primary-dark text-xs font-semibold">
                            {city.facilityCount}
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
      </div>
    </section>
  );
}
