"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Phone, Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { navigationLinks, type NavLink } from "@/data/site-config";
import skinConfig from "@/skin.config";

interface NavbarProps {
  brandName?: string;
  /** Real brand logo image. When absent, falls back to an initial-letter mark +
   *  brand text. IMPORT-dependent: the legacy `brand.logo` asset isn't imported
   *  yet, so this is undefined today and the text fallback renders. */
  logoUrl?: string;
  links?: NavLink[];
  phone?: string;
  ctaText?: string;
  ctaHref?: string;
}

/** Mirrors the legacy mega-menu: long flyout lists are split into columns. */
const MAX_ITEMS_PER_COLUMN = 13;

/**
 * Split a list into evenly distributed columns of at most `maxPerColumn`,
 * front-loading the extra items. Ported (not imported) from the legacy
 * `storage-theme-payload` MainNav `splitIntoColumns`.
 */
function splitIntoColumns<T>(items: T[], maxPerColumn = MAX_ITEMS_PER_COLUMN): T[][] {
  const len = items.length;
  if (len <= maxPerColumn) return [items];

  const numColumns = Math.ceil(len / maxPerColumn);
  const base = Math.floor(len / numColumns);
  const extra = len % numColumns;

  const columns: T[][] = [];
  let i = 0;
  for (let col = 0; col < numColumns; col++) {
    const size = base + (col < extra ? 1 : 0);
    columns.push(items.slice(i, i + size));
    i += size;
  }
  return columns;
}

/**
 * Site-wide navigation. Ported from `storage-theme-payload`'s Header to match it
 * 1:1: a WHITE, static (non-sticky) bar with `shadow-sm`, brand on the left,
 * dark `font-semibold` primary nav in the center, and a filled-blue CTA on the
 * right. Below 1300px it collapses to a hamburger that opens a full-screen WHITE
 * overlay (logo + close X, dark accordion rows). Legacy breaks at 1300px (not
 * the template's old 1024) and locks body scroll while the overlay is open.
 *
 * Editor contract:
 *  - root tagged `data-nocms-component="navbar"`
 *  - brand text leaf tagged `data-role="brand-name"`
 *  - primary CTA tagged `data-role="cta"`
 *
 * Imported nav (`links`) supports up to 3 levels on DESKTOP — top panel →
 * state rows → flyout of facilities (the legacy "Locations → California →
 * cities" shape). The top dropdown panel lists a link's direct children as
 * rows; a child WITH children renders as a row (label + right-chevron) that
 * opens a NESTED flyout to the side listing its own children (column-split
 * when long, mirroring the legacy mega-menu); a child WITHOUT children is a
 * plain link. Anything deeper is flattened to links in the flyout — no 4th
 * level is built (mobile recurses further). The migration's converter is the
 * gate that keeps menus within this.
 */
export function Navbar({
  brandName = skinConfig.brandName,
  logoUrl = skinConfig.logoUrl,
  links = navigationLinks,
  phone = skinConfig.contactPhone ?? "",
  ctaText = "Pay Online",
  ctaHref = "/pay-online",
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  // Which child-with-children row inside the open dropdown has its side flyout
  // showing. Keyed by the row's label/href so only one flyout mounts at a time.
  const [openSubItem, setOpenSubItem] = useState<string | null>(null);
  // Desktop nav cluster — anchors click-outside detection for the open dropdown.
  const desktopNavRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = useCallback((label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
    setOpenSubItem(null);
  }, []);

  const closeDropdown = useCallback(() => {
    setOpenDropdown(null);
    setOpenSubItem(null);
  }, []);

  // Dropdowns open on CLICK (not hover) — close on click-outside or Escape so
  // the panel stays put while the user moves to a sub-item (hover was poor UX).
  useEffect(() => {
    if (!openDropdown) return;
    const onMouseDown = (e: MouseEvent) => {
      if (desktopNavRef.current && !desktopNavRef.current.contains(e.target as Node)) closeDropdown();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDropdown();
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openDropdown, closeDropdown]);

  // Lock body scroll while the full-screen mobile overlay is open (legacy parity).
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  // Logo: real `<img>` when a brand logo asset exists, else an initial-letter
  // mark + brand text. Dark/brand-colored so it reads on the white bar. The
  // editor's brand-name leaf is tagged only in the BAR (not the overlay copy).
  const renderLogo = (tagBrand: boolean) => (
    <a href="/" className="flex items-center gap-3 group" data-nocms-component="navbar">
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt={brandName}
          className="w-auto max-w-[200px] max-h-[48px] min-[1300px]:max-h-[56px]" data-role="media"
        />
      ) : (
        <>
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-heading text-lg font-bold">{brandName.charAt(0)}</span>
          </div>
          <span
            {...(tagBrand ? { "data-role": "brand-name" } : {})}
            className="font-heading text-xl font-bold text-text tracking-tight group-hover:text-primary transition-colors"
          >
            {brandName}
          </span>
        </>
      )}
    </a>
  );

  // Header search — outlined pill + magnifying-glass submit, matching the legacy
  // HeaderSearch (h-10, rounded-full, "Search" placeholder, icon inset right).
  // Submits to /search via GET. `widthClass` lets the desktop slot fix a width
  // while the mobile overlay goes full-width.
  const renderSearch = (widthClass: string) => (
    <form action="/search" method="get" role="search" className={`relative ${widthClass}`}>
      <input
        type="search"
        name="q"
        placeholder="Search"
        aria-label="Search pages, markets, and facilities"
        className="h-10 w-full rounded-full border border-black/15 bg-background pl-5 pr-11 text-base text-text placeholder:text-muted focus:outline-none focus-visible:outline-2 focus-visible:outline-primary"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-text hover:text-primary transition-colors"
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-5 w-5">
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
          <path d="m14 14 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </form>
  );

  return (
    <header
      data-nocms-component="navbar"
      className="relative z-40 bg-background shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:font-semibold" data-role="text"
      >
        Skip to main content
      </a>

      <nav className="px-4 sm:px-6 lg:px-12" aria-label="Main navigation">
        {/* Full-width bar matching legacy `.header-nav__wrapper` (flex justify-between):
            logo near the edge (~48px), the search/CTA cluster at the right, and the
            nav CENTERED in the free space between them — so it drifts toward the bar
            center as the viewport widens, exactly like legacy. */}
        <div className="flex h-[69px] min-[1300px]:h-[77px] items-center justify-between">
          {renderLogo(true)}

          <div ref={desktopNavRef} className="hidden min-[1300px]:flex items-center gap-2">
            {(links ?? []).map((link) =>
              link.children && link.children.length > 0 ? (
                <div key={link.label} className="relative">
                  <button
                    className="flex items-center gap-1 whitespace-nowrap px-4 py-2 text-base min-[1500px]:text-lg font-semibold text-text"
                    aria-expanded={openDropdown === link.label}
                    aria-haspopup="true"
                    onClick={() => toggleDropdown(link.label)}
                  >
                    {link.label}
                    <ChevronDown
                      strokeWidth={1.75}
                      className={`h-[13px] w-[13px] text-primary transition-transform ${
                        openDropdown === link.label ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {openDropdown === link.label && (
                    <div className="absolute top-full left-0 mt-2 w-64 rounded-sm bg-background shadow-[0_3px_6px_rgba(0,0,0,0.1)] py-2">
                      {link.children.map((child) => {
                        const childKey = child.href ?? child.label;
                        const hasGrandchildren = Boolean(
                          child.children && child.children.length > 0,
                        );

                        // Child WITH children: a row (link if it has an href,
                        // else a hover/focus button) carrying a right-chevron
                        // that opens a NESTED flyout of its own children.
                        if (hasGrandchildren) {
                          const flyoutOpen = openSubItem === childKey;
                          const columns = splitIntoColumns(child.children!);
                          const rowClasses =
                            "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-sm font-semibold text-text hover:bg-primary-light hover:text-primary transition-colors text-left";

                          return (
                            <div
                              key={childKey}
                              className="relative"
                              onMouseEnter={() => setOpenSubItem(childKey)}
                              onMouseLeave={() => setOpenSubItem(null)}
                            >
                              {child.href ? (
                                <a
                                  href={child.href}
                                  className={rowClasses}
                                  aria-haspopup="true"
                                  aria-expanded={flyoutOpen}
                                  onFocus={() => setOpenSubItem(childKey)}
                                >
                                  <span>{child.label}</span>
                                  <ChevronRight className="h-4 w-4 opacity-70" aria-hidden="true" />
                                </a>
                              ) : (
                                <button
                                  type="button"
                                  className={rowClasses}
                                  aria-haspopup="true"
                                  aria-expanded={flyoutOpen}
                                  onFocus={() => setOpenSubItem(childKey)}
                                  onClick={() =>
                                    setOpenSubItem((prev) => (prev === childKey ? null : childKey))
                                  }
                                >
                                  <span>{child.label}</span>
                                  <ChevronRight className="h-4 w-4 opacity-70" aria-hidden="true" />
                                </button>
                              )}

                              {flyoutOpen && (
                                <div className="absolute top-0 left-full ml-1 flex rounded-sm bg-background shadow-[0_3px_6px_rgba(0,0,0,0.1)] py-2">
                                  {columns.map((column, colIndex) => (
                                    <div
                                      key={`col-${colIndex}`}
                                      className={`w-60 ${colIndex > 0 ? "border-l border-text/10" : ""}`}
                                    >
                                      {column.map((leaf) =>
                                        // 3-level ceiling: a flyout item is always
                                        // a link/text even if it somehow has children.
                                        leaf.href ? (
                                          <a
                                            key={leaf.href}
                                            href={leaf.href}
                                            className="block px-4 py-2 text-sm text-text hover:bg-primary-light hover:text-primary transition-colors"
                                          >
                                            {leaf.label}
                                          </a>
                                        ) : (
                                          <span
                                            key={leaf.label}
                                            className="block px-4 py-2 text-sm text-text"
                                          >
                                            {leaf.label}
                                          </span>
                                        ),
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        }

                        // Child WITHOUT children: a plain link (with optional
                        // description), or a non-link heading if it has no href.
                        return child.href ? (
                          <a
                            key={childKey}
                            href={child.href}
                            className="flex items-start gap-3 px-4 py-2.5 text-sm font-semibold text-text hover:bg-primary-light hover:text-primary transition-colors"
                          >
                            <div>
                              <span className="block">{child.label}</span>
                              {child.description && (
                                <span className="text-muted text-xs font-normal">{child.description}</span>
                              )}
                            </div>
                          </a>
                        ) : (
                          <span
                            key={childKey}
                            className="block px-4 py-2.5 text-sm font-semibold text-text"
                          >
                            {child.label}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={link.href ?? link.label}
                  href={link.href ?? "#"}
                  className="whitespace-nowrap px-4 py-2 text-base min-[1500px]:text-lg font-semibold text-text"
                >
                  {link.label}
                </a>
              )
            )}
          </div>

          <div className="hidden min-[1300px]:flex items-center gap-3">
            {renderSearch("w-40 min-[1500px]:w-52")}
            {phone && (
              <a
                href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                className="flex items-center gap-2 text-sm text-text hover:text-primary font-semibold transition-colors"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                <span>{phone}</span>
              </a>
            )}
            <a
              href={ctaHref}
              data-role="cta"
              className="inline-flex h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-primary px-6 text-base font-bold text-white hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {ctaText}
            </a>
          </div>

          <button
            className="min-[1300px]:hidden p-2 rounded-md hover:bg-black/5 transition-colors focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <Menu className="h-6 w-6 text-primary" />
          </button>
        </div>
      </nav>

      {/* Mobile: full-screen WHITE overlay (legacy), not a dropdown below the bar. */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[1001] h-screen w-screen overflow-y-auto bg-background min-[1300px]:hidden">
          <div className="flex h-[69px] items-center justify-between px-4 border-b border-text/10">
            {renderLogo(false)}
            <button
              type="button"
              className="p-2 text-primary"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="px-4 py-3 border-b border-text/10">{renderSearch("w-full")}</div>
          <div className="pb-2">
            {(links ?? []).map((link) => (
              <MobileNavItem
                key={link.href ?? link.label}
                link={link}
                depth={0}
                onNavigate={() => setMobileOpen(false)}
              />
            ))}
          </div>
          <div className="px-4 py-4 space-y-3">
            {phone && (
              <a
                href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                className="flex items-center gap-2 text-sm text-text font-semibold"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {phone}
              </a>
            )}
            <a
              href={ctaHref}
              className="block text-center bg-primary text-white font-semibold px-6 py-3 rounded-md"
              onClick={() => setMobileOpen(false)} data-role="cta-2"
            >
              {ctaText}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

/**
 * Mobile nav row, a collapsible accordion (legacy parity): a parent row toggles
 * its children open/closed with a blue chevron; leaves are links. Recursive so
 * legacy 3-level menus render with increasing indent. Dark text + bottom-border
 * dividers on top-level rows, on the white overlay.
 */
function MobileNavItem({
  link,
  depth,
  onNavigate,
}: {
  link: NavLink;
  depth: number;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const hasChildren = Boolean(link.children && link.children.length > 0);
  // Indent grows one step per level: 4 / 8 / 12 (clamped) units of left padding.
  const padLeft = ["pl-4", "pl-8", "pl-12"][Math.min(depth, 2)];
  const textSize = depth === 0 ? "text-base font-semibold" : "text-sm";
  const textColor = depth === 0 ? "text-text" : "text-muted";
  const divider = depth === 0 ? "border-b border-text/10" : "";

  if (hasChildren) {
    return (
      <div className={divider}>
        <button
          type="button"
          className={`flex w-full items-center justify-between ${padLeft} pr-4 py-3 ${textSize} ${textColor}`}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span>{link.label}</span>
          <ChevronDown
            className={`h-4 w-4 text-primary transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
        {open && (
          <div className="pb-1">
            {link.children!.map((child) => (
              <MobileNavItem
                key={child.href ?? child.label}
                link={child}
                depth={depth + 1}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={divider}>
      {link.href ? (
        <a
          href={link.href}
          className={`block ${padLeft} pr-4 py-3 ${textSize} ${textColor} hover:text-primary transition-colors`}
          onClick={onNavigate}
        >
          {link.label}
        </a>
      ) : (
        <span className={`block ${padLeft} pr-4 py-3 ${textSize} text-muted font-semibold`}>
          {link.label}
        </span>
      )}
    </div>
  );
}
