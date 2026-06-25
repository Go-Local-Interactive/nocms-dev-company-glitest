import * as React from "react";
import skinConfig from "@/skin.config";

/**
 * Brand logo. Source `storage-theme-payload` HeaderLogo loaded the logo from
 * Payload (tenant → brand → media object). Here we render either an
 * `<img>` (when `logoUrl` is given) or a clean letterform tile fallback
 * built from the brand name's first character. Either way the link wraps
 * back to `/`.
 *
 * Editor contract:
 *  - root tagged `data-nocms-component="main-logo"`
 *  - the brand-name text leaf carries `data-role="brand-name"`
 *  - the logo image (when present) carries `data-role="media"`
 */
interface MainLogoProps {
  brandName?: string;
  /** Optional logo image URL. When omitted, renders a letterform tile. */
  logoUrl?: string;
  /** Alt text for the logo image. Defaults to `${brandName} logo`. */
  logoAlt?: string;
  /** Show the brand name next to the mark. Defaults to true. */
  showText?: boolean;
  /** Visual size — `sm` (header), `md` (footer), `lg` (login/branded landing). */
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Tone — `light` for dark backgrounds (white text/glyph), `dark` for light backgrounds. */
  tone?: "light" | "dark";
}

const tileSize = { sm: "h-9 w-9", md: "h-11 w-11", lg: "h-14 w-14" };
const labelSize = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
};
const imageHeight = { sm: 36, md: 56, lg: 72 };

export function MainLogo({
  brandName = skinConfig.brandName,
  logoUrl,
  logoAlt,
  showText = true,
  size = "sm",
  tone = "light",
  className = "",
}: MainLogoProps) {
  const tileTone =
    tone === "light" ? "bg-white/10 text-white" : "bg-primary/10 text-primary";
  const labelTone = tone === "light" ? "text-white" : "text-text";

  return (
    <a
      href="/"
      data-nocms-component="main-logo"
      className={`flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md ${className}`}
    >
      {logoUrl ? (
        <img
          data-role="media"
          src={logoUrl}
          alt={logoAlt ?? `${brandName} logo`}
          height={imageHeight[size]}
          className="object-contain"
          style={{ height: imageHeight[size] }}
        />
      ) : (
        <div
          aria-hidden="true"
          className={`${tileSize[size]} rounded-lg flex items-center justify-center font-heading font-bold ${tileTone}`}
        >
          {brandName.charAt(0)}
        </div>
      )}
      {showText && (
        <span
          data-role="brand-name"
          className={`font-heading font-bold tracking-tight transition-colors group-hover:opacity-90 ${labelSize[size]} ${labelTone}`}
        >
          {brandName}
        </span>
      )}
    </a>
  );
}
