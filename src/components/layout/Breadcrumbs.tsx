import * as React from "react";
import { ChevronRight } from "lucide-react";

/**
 * Breadcrumb trail. Source from `storage-theme-payload`'s Breadcrumbs +
 * `innerCrumbsDesktop` / `innerCrumbsMobile` — collapsed here into a single
 * responsive list (intermediate crumbs hide below `md` and collapse to an
 * ellipsis). The dropdown-menu mobile mode is dropped — restoring it would
 * require Radix.
 *
 * Editor contract: root tagged `data-nocms-component="breadcrumbs"`.
 */

export interface BreadcrumbItem {
  label: string;
  /** Absolute path. Omit for the current (final) crumb. */
  href?: string;
}

interface BreadcrumbsProps {
  /** Intermediate + current trail. The "Home" crumb is prepended automatically. */
  items: BreadcrumbItem[];
  className?: string;
  homeLabel?: string;
  homeHref?: string;
}

export function Breadcrumbs({
  items,
  className = "",
  homeLabel = "Home",
  homeHref = "/",
}: BreadcrumbsProps) {
  const all: BreadcrumbItem[] = [{ label: homeLabel, href: homeHref }, ...items];
  const last = all.length - 1;
  const middle = all.slice(1, last);
  const current = all[last];

  return (
    <nav
      data-nocms-component="breadcrumbs"
      aria-label="Breadcrumb"
      className={`text-sm ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-1 text-muted">
        <li>
          <a href={homeHref} className="hover:text-text transition-colors">
            {homeLabel}
          </a>
        </li>

        {middle.length > 0 && (
          <li className="md:hidden flex items-center gap-1" aria-hidden="true">
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            <span>...</span>
          </li>
        )}

        {middle.map((crumb) => (
          <React.Fragment key={`${crumb.href ?? ""}-${crumb.label}`}>
            <li className="hidden md:flex items-center" aria-hidden="true">
              <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            </li>
            <li className="hidden md:list-item">
              {crumb.href ? (
                <a href={crumb.href} className="hover:text-text transition-colors">
                  {crumb.label}
                </a>
              ) : (
                <span>{crumb.label}</span>
              )}
            </li>
          </React.Fragment>
        ))}

        <li className="flex items-center" aria-hidden="true">
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
        </li>
        <li
          className="text-text font-medium max-w-[12rem] sm:max-w-none truncate"
          aria-current="page"
        >
          {current.label}
        </li>
      </ol>
    </nav>
  );
}
