import type { NavItem, NavColumn } from "./payload";
import type { NavLink, FooterColumn } from "@/data/site-config";

/**
 * Convert the imported header `NavItem[]` (off the tenant's `nav` config) into
 * the template's `NavLink[]` shape consumed by `<Navbar />`. The only field
 * difference is `url` → `href`; children recurse. `newTab` is dropped — the
 * nav doesn't render `target=_blank`.
 */
export function navItemsToLinks(items: NavItem[]): NavLink[] {
  return items.map((it) => ({
    label: it.label,
    ...(it.url ? { href: it.url } : {}),
    ...(it.children && it.children.length > 0
      ? { children: navItemsToLinks(it.children) }
      : {}),
  }));
}

/**
 * Footer columns: `NavColumn {title, items}` → `FooterColumn {title, links}`.
 * Footers render as FLAT link lists, so nested items are flattened and only
 * entries with a resolvable `url` are kept (a label-only footer entry has
 * nothing to link to). Columns left with no links are dropped.
 */
export function navColumnsToFooterColumns(cols: NavColumn[]): FooterColumn[] {
  const flatten = (items: NavItem[]): { label: string; href: string }[] =>
    items.flatMap((it) => [
      ...(it.url ? [{ label: it.label, href: it.url }] : []),
      ...(it.children ? flatten(it.children) : []),
    ]);
  return cols
    .map((c) => ({ title: c.title, links: flatten(c.items) }))
    .filter((c) => c.links.length > 0);
}

/** Policy/legal links row: `NavItem[]` → flat `{label, href}` list (href-only). */
export function navItemsToPolicyLinks(items: NavItem[]): { label: string; href: string }[] {
  return items.flatMap((it) => (it.url ? [{ label: it.label, href: it.url }] : []));
}
