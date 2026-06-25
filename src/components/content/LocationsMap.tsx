"use client";

import * as React from "react";

/**
 * Client-side Google Map for the `map-locations` block — ports the legacy
 * `storage-theme-payload` HybridMap/DynamicMap behaviour: brand-coloured
 * numbered pins (one per facility), fit to bounds, info window on click. Loads
 * the Maps JS API via a script tag (no npm dependency) using the tenant's
 * referrer-restricted browser key, and reads the pin colour from the live
 * `--color-primary` token so it matches the tenant brand automatically.
 */

export interface MapMarker {
  lat: number;
  lng: number;
  title: string;
  href: string;
  /** 1-based pin number, rendered as the glyph (matches legacy numbered pins). */
  label: string;
}

// ── Minimal Google Maps type surface (only what we call) — avoids pulling in
//    @types/google.maps just for a handful of constructors. ───────────────────
type LatLngLiteral = { lat: number; lng: number };
interface GMap {
  setCenter(p: LatLngLiteral): void;
  setZoom(z: number): void;
  fitBounds(b: GLatLngBounds, padding?: number): void;
}
interface GLatLngBounds {
  extend(p: LatLngLiteral): void;
  getCenter(): LatLngLiteral;
}
interface GMarker {
  addListener(event: string, cb: () => void): void;
  setMap(map: GMap | null): void;
}
interface GInfoWindow {
  setContent(content: string): void;
  open(opts: { anchor: GMarker; map: GMap }): void;
  close(): void;
}
interface GoogleMaps {
  Map: new (el: HTMLElement, opts: Record<string, unknown>) => GMap;
  Marker: new (opts: Record<string, unknown>) => GMarker;
  InfoWindow: new (opts?: Record<string, unknown>) => GInfoWindow;
  LatLngBounds: new () => GLatLngBounds;
  Size: new (w: number, h: number) => unknown;
  Point: new (x: number, y: number) => unknown;
}
declare global {
  interface Window {
    google?: { maps: GoogleMaps };
    __nocmsGmapsCb?: () => void;
  }
}

// Singleton script load so re-renders / multiple maps share one Maps JS load.
let mapsPromise: Promise<GoogleMaps> | null = null;
function loadMaps(apiKey: string): Promise<GoogleMaps> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.google?.maps) return Promise.resolve(window.google.maps);
  if (mapsPromise) return mapsPromise;
  mapsPromise = new Promise<GoogleMaps>((resolve, reject) => {
    window.__nocmsGmapsCb = () => {
      if (window.google?.maps) resolve(window.google.maps);
      else reject(new Error("Maps loaded without namespace"));
    };
    const s = document.createElement("script");
    s.src =
      "https://maps.googleapis.com/maps/api/js?key=" +
      encodeURIComponent(apiKey) +
      "&callback=__nocmsGmapsCb&loading=async";
    s.async = true;
    s.onerror = () => reject(new Error("Google Maps failed to load"));
    document.head.appendChild(s);
  });
  return mapsPromise;
}

function cssVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

const escapeHtml = (s: string): string =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );

/** Brand-coloured teardrop pin with a centred white number, as a data-URI SVG. */
function pinIcon(primary: string, primaryDark: string, n: string): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="42" viewBox="0 0 30 42">` +
    `<path d="M15 0C6.7 0 0 6.7 0 15c0 11.25 15 27 15 27s15-15.75 15-27C30 6.7 23.3 0 15 0z" fill="${primary}" stroke="${primaryDark}" stroke-width="1"/>` +
    `<text x="15" y="20" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="14" font-weight="700" fill="#ffffff">${escapeHtml(n)}</text>` +
    `</svg>`;
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

export function LocationsMap({
  apiKey,
  markers,
}: {
  apiKey: string;
  markers: MapMarker[];
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [error, setError] = React.useState(false);
  // Stable string proxy for the markers array so the effect re-runs only when the
  // coordinates actually change — not on every parent re-render with a fresh ref.
  const markersKey = markers.map((m) => `${m.lat},${m.lng}`).join("|");

  React.useEffect(() => {
    let cancelled = false;
    const el = ref.current;
    if (!el) return;
    const createdMarkers: GMarker[] = [];
    let createdInfo: GInfoWindow | null = null;

    loadMaps(apiKey)
      .then((maps) => {
        if (cancelled) return;
        const primary = cssVar("--color-primary", "#1400ff");
        const primaryDark = cssVar("--color-primary-dark", "#0f00b3");

        const map = new maps.Map(el, {
          center: { lat: 38.9314, lng: -94.682 }, // central US fallback
          zoom: markers.length ? 5 : 4,
          minZoom: 3,
          maxZoom: 20,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          clickableIcons: false,
        });

        // No geo yet (e.g. FMS not joined) — show the live map without pins;
        // markers fill in automatically once facilities carry coordinates.
        if (markers.length === 0) return;

        const bounds = new maps.LatLngBounds();
        const info = new maps.InfoWindow();
        createdInfo = info;

        markers.forEach((m) => {
          const position = { lat: m.lat, lng: m.lng };
          bounds.extend(position);
          const marker = new maps.Marker({
            map,
            position,
            title: m.title,
            icon: {
              url: pinIcon(primary, primaryDark, m.label),
              scaledSize: new maps.Size(30, 42),
              anchor: new maps.Point(15, 42),
            },
          });
          createdMarkers.push(marker);
          marker.addListener("click", () => {
            info.setContent(
              `<div style="font-family:inherit;min-width:160px;line-height:1.4">` +
                `<strong>${escapeHtml(m.title)}</strong><br/>` +
                `<a href="${escapeHtml(m.href)}" style="color:${primary};font-weight:600;text-decoration:none">View location &rarr;</a>` +
                `</div>`,
            );
            info.open({ anchor: marker, map });
          });
        });

        if (markers.length === 1) {
          map.setCenter(bounds.getCenter());
          map.setZoom(13);
        } else {
          map.fitBounds(bounds, 40);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
      // Dispose so a deps change can't stack a second map's markers/info on the div.
      createdMarkers.forEach((mk) => mk.setMap(null));
      createdInfo?.close();
    };
    // markersKey is the stable proxy for `markers` (re-run only when coords change).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, markersKey]);

  if (error) {
    return (
      <div className="h-full w-full min-h-[400px] rounded-lg bg-surface flex items-center justify-center text-muted text-sm" data-nocms-component="locations-map">
        Map unavailable
      </div>
    );
  }

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Map of storage locations"
      className="h-full w-full min-h-[400px] rounded-lg overflow-hidden bg-surface"
    />
  );
}
