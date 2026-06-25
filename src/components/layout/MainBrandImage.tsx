import * as React from "react";
import skinConfig from "@/skin.config";

/**
 * Brand-image display — used on landing pages and marketing sections to show
 * the brand mark at a larger size than `MainLogo` (which is sized for header
 * use). No upstream source — built in this port to satisfy the brand-image
 * slot referenced by storage-theme-payload's hero compositions.
 *
 * Editor contract: root carries `data-nocms-component="main-brand-image"`,
 * the image carries `data-role="media"`.
 */
interface MainBrandImageProps {
  /** Image URL. When omitted, falls back to a letterform tile from the brand name. */
  src?: string;
  alt?: string;
  brandName?: string;
  /** Visual width tier — `sm` (sidebar/marketing strip), `md` (default),
   * `lg` (full-bleed marketing hero). */
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
}

const sizeClass = {
  sm: "max-w-[160px]",
  md: "max-w-[240px]",
  lg: "max-w-[360px]",
};

const tileSize = {
  sm: "h-20 w-20 text-3xl",
  md: "h-32 w-32 text-5xl",
  lg: "h-48 w-48 text-7xl",
};

export function MainBrandImage({
  src,
  alt,
  brandName = skinConfig.brandName,
  size = "md",
  href,
  className = "",
}: MainBrandImageProps) {
  const resolvedAlt = alt ?? `${brandName} brand image`;

  const inner = src ? (
    <img
      data-role="media"
      src={src}
      alt={resolvedAlt}
      className={`block w-full h-auto ${sizeClass[size]}`}
    />
  ) : (
    <div
      aria-hidden="true"
      className={`mx-auto rounded-2xl flex items-center justify-center font-heading font-bold bg-primary/10 text-primary ${tileSize[size]}`}
    >
      {brandName.charAt(0)}
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        data-nocms-component="main-brand-image"
        className={`inline-block ${className}`}
      >
        {inner}
      </a>
    );
  }

  return (
    <div
      data-nocms-component="main-brand-image"
      className={`inline-block ${className}`}
    >
      {inner}
    </div>
  );
}
