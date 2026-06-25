"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UrlObject } from "url";

/**
 * Internal link wrapper. Source is `storage-theme-payload`'s AppLink, which
 * was a plain `<a>` (skipping `next/link` to avoid RSC `.txt` fetches under
 * `output: export`). Here we wrap `next/link` and add active-state styling
 * — the editor app drives navigation through Next, so we want client-side
 * routing back.
 *
 * Editor contract: root tagged `data-nocms-component="app-link"`. Optional
 * `data-role="cta"` is forwarded.
 */

type AppLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string | UrlObject;
  /** Class applied when the current pathname exactly matches `href`. */
  activeClassName?: string;
  /** Class applied when the current pathname starts with `href`. */
  partialActiveClassName?: string;
  children?: React.ReactNode;
  "data-role"?: string;
};

export const AppLink = React.forwardRef<HTMLAnchorElement, AppLinkProps>(
  (
    {
      href,
      className = "",
      activeClassName = "",
      partialActiveClassName = "",
      children,
      "data-role": dataRole,
      ...props
    },
    ref,
  ) => {
    const pathname = usePathname();
    const resolvedHref =
      typeof href === "string"
        ? href
        : (href.pathname ?? "") + (href.search ?? "") + (href.hash ?? "");

    const isExactActive = pathname === resolvedHref;
    const isPartialActive =
      resolvedHref !== "/" && pathname?.startsWith(resolvedHref);

    const composedClass = [
      className,
      isExactActive ? activeClassName : "",
      isPartialActive && !isExactActive ? partialActiveClassName : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Link
        ref={ref}
        href={resolvedHref}
        data-nocms-component="app-link"
        data-role={dataRole}
        aria-current={isExactActive ? "page" : undefined}
        className={composedClass}
        {...props}
      >
        {children}
      </Link>
    );
  },
);

AppLink.displayName = "AppLink";

export default AppLink;
