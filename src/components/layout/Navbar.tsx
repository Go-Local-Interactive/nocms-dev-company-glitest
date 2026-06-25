"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Phone, Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { navigationLinks, type NavLink } from "@/data/site-config";
import skinConfig from "@/skin.config";

interface NavbarProps {
  brandName?: string;
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
 * Site-wide navigation. Ported from `storage-theme-payload`'s Header — a
 * sticky bar with brand on the left, primary nav in the center, phone +
 * primary CTA on the right, and a mobile hamburger drawer below 1024px.
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
  links = navigationLinks,
  phone = skinConfig.contactPhone ?? "",
  ctaText = "Reserve a Unit",
  ctaHref = "/reserve-online",
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  // Which child-with-children row inside the open dropdown has its side flyout
  // showing. Keyed by the row's label/href so only one flyout mounts at a time.
  const [openSubItem, setOpenSubItem] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  // Desktop nav cluster — anchors click-outside detection for the open dropdown.
  const desktopNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  return (
    <header
      data-nocms-component="navbar"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-primary shadow-lg shadow-primary/15" : "bg-primary"
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-accent focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:font-semibold"
      >
        Skip to main content
      </a>

      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-[72px] items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center">
              <span className="text-white font-heading text-lg font-bold">
                {brandName.charAt(0)}
              </span>
            </div>
            <span
              data-role="brand-name"
              className="font-heading text-xl font-bold text-white tracking-tight group-hover:text-white/80 transition-colors"
            >
              {brandName}
            </span>
          </a>

          <div ref={desktopNavRef} className="hidden lg:flex items-center gap-1">
            {(links ?? []).map((link) =>
              link.children && link.children.length > 0 ? (
                <div key={link.label} className="relative">
                  <button
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white/85 hover:text-white transition-colors rounded-md hover:bg-white/8"
                    aria-expanded={openDropdown === link.label}
                    aria-haspopup="true"
                    onClick={() => toggleDropdown(link.label)}
                  >
                    {link.label}
                    <ChevronDown
                      className={`h-3.5 w-3.5 opacity-60 transition-transform ${
                        openDropdown === link.label ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {openDropdown === link.label && (
                    <div className="absolute top-full left-0 mt-2 w-72 rounded-md bg-background border border-text/5 shadow-xl shadow-text/10 py-2">
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
                            "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-sm text-text/80 hover:text-text hover:bg-surface transition-colors text-left";

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
                                  <span className="font-semibold text-text">{child.label}</span>
                                  <ChevronRight className="h-4 w-4 opacity-60" aria-hidden="true" />
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
                                  <span className="font-semibold text-text">{child.label}</span>
                                  <ChevronRight className="h-4 w-4 opacity-60" aria-hidden="true" />
                                </button>
                              )}

                              {flyoutOpen && (
                                <div className="absolute top-0 left-full ml-1 flex rounded-md bg-background border border-text/5 shadow-xl shadow-text/10 py-2">
                                  {columns.map((column, colIndex) => (
                                    <div
                                      key={`col-${colIndex}`}
                                      className={`w-60 ${colIndex > 0 ? "border-l border-text/5" : ""}`}
                                    >
                                      {column.map((leaf) =>
                                        // 3-level ceiling: a flyout item is always
                                        // a link/text even if it somehow has children.
                                        leaf.href ? (
                                          <a
                                            key={leaf.href}
                                            href={leaf.href}
                                            className="block px-4 py-2 text-sm text-text/80 hover:text-text hover:bg-surface transition-colors"
                                          >
                                            {leaf.label}
                                          </a>
                                        ) : (
                                          <span
                                            key={leaf.label}
                                            className="block px-4 py-2 text-sm text-text/80"
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
                            className="flex items-start gap-3 px-4 py-3 text-sm text-text/80 hover:text-text hover:bg-surface transition-colors"
                          >
                            <div>
                              <span className="font-semibold text-text block">{child.label}</span>
                              {child.description && (
                                <span className="text-muted text-xs">{child.description}</span>
                              )}
                            </div>
                          </a>
                        ) : (
                          <span
                            key={childKey}
                            className="block px-4 py-3 text-sm font-semibold text-text"
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
                  className="px-4 py-2 text-sm font-medium text-white/85 hover:text-white transition-colors rounded-md hover:bg-white/8"
                >
                  {link.label}
                </a>
              )
            )}
          </div>

          <div className="hidden lg:flex items-center gap-5">
            {phone && (
              <a
                href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                className="flex items-center gap-2 text-sm text-white/80 hover:text-white font-semibold transition-colors"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                <span>{phone}</span>
              </a>
            )}
            <a
              href={ctaHref}
              data-role="cta"
              className="bg-sand text-primary-dark font-semibold px-5 py-2.5 rounded-md text-sm shadow-md hover:bg-background hover:shadow-lg hover:-translate-y-0.5 transition-all focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            >
              {ctaText}
            </a>
          </div>

          <button
            className="lg:hidden p-2 rounded-md hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-white/10 py-4 space-y-1">
            {(links ?? []).map((link) => (
              <MobileNavItem
                key={link.href ?? link.label}
                link={link}
                depth={0}
                onNavigate={() => setMobileOpen(false)}
              />
            ))}
            <div className="pt-4 px-4 space-y-3 border-t border-white/10 mt-4">
              {phone && (
                <a
                  href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                  className="flex items-center gap-2 text-sm text-white/80 font-semibold"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {phone}
                </a>
              )}
              <a
                href={ctaHref}
                className="block text-center bg-secondary text-white font-semibold px-6 py-3 rounded-md shadow-lg"
              >
                {ctaText}
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

/**
 * Mobile nav row, recursive so legacy 3-level menus render with increasing
 * indent. A link-less parent (label-only dropdown) renders as a non-link
 * heading; leaves with an `href` render as links.
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
  // Indent grows one step per level: 4 / 8 / 12 (clamped) units of left padding.
  const padLeft = ["pl-4", "pl-8", "pl-12"][Math.min(depth, 2)];
  const hasChildren = Boolean(link.children && link.children.length > 0);
  const textSize = depth === 0 ? "text-base font-medium" : "text-sm";
  const textColor = depth === 0 ? "text-white/85" : "text-white/70";

  return (
    <div>
      {link.href ? (
        <a
          href={link.href}
          className={`block ${padLeft} pr-4 py-2.5 ${textSize} ${textColor} hover:text-white hover:bg-white/8 rounded-md transition-colors`}
          onClick={onNavigate}
        >
          {link.label}
        </a>
      ) : (
        <span
          className={`block ${padLeft} pr-4 py-2.5 ${textSize} text-white/60 font-semibold`}
        >
          {link.label}
        </span>
      )}
      {hasChildren &&
        link.children!.map((child) => (
          <MobileNavItem
            key={child.href ?? child.label}
            link={child}
            depth={depth + 1}
            onNavigate={onNavigate}
          />
        ))}
    </div>
  );
}
