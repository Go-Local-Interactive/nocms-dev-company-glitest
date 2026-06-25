import * as React from "react";
import { ArrowRight } from "lucide-react";

/**
 * Full-bleed hero with a background image, color overlay, and centered text +
 * CTA. Source: storage-theme-payload `src/blocks/MediaOverlay`. The Lexical
 * `content` field is replaced with plain string heading/subheading props; the
 * 9-position grid + Vimeo background + backdrop variants from the upstream are
 * dropped — this version is the common case (image + overlay + centered text).
 *
 * Editor contract: heading on the `<h1>`, subheading on the `<p>`, primary
 * CTA carries `data-role="cta"`, and the bg image carries `data-role="media"`.
 */

interface HeroOverlayCta {
  label: string;
  href: string;
}

interface HeroOverlayProps {
  heading: string;
  subheading?: string;
  backgroundImage?: string;
  imageAlt?: string;
  primaryCta?: HeroOverlayCta;
  secondaryCta?: HeroOverlayCta;
  /** 0-100, applied as the overlay layer alpha. Defaults to 60. */
  overlayOpacity?: number;
  overlayColor?: "primary" | "secondary" | "dark";
  contentPosition?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "center-left"
    | "center"
    | "center-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  minHeight?: "small" | "medium" | "large" | "extra-large";
}

const overlayBgMap = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  dark: "bg-text",
};

const minHeightMap = {
  small: "min-h-[300px]",
  medium: "min-h-[400px]",
  large: "min-h-[500px]",
  "extra-large": "min-h-[600px]",
};

const positionMap = {
  "top-left": "items-start justify-start text-left",
  "top-center": "items-start justify-center text-center",
  "top-right": "items-start justify-end text-right",
  "center-left": "items-center justify-start text-left",
  center: "items-center justify-center text-center",
  "center-right": "items-center justify-end text-right",
  "bottom-left": "items-end justify-start text-left",
  "bottom-center": "items-end justify-center text-center",
  "bottom-right": "items-end justify-end text-right",
};

export function HeroOverlay({
  heading,
  subheading,
  backgroundImage = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80",
  imageAlt = "",
  primaryCta,
  secondaryCta,
  overlayOpacity = 60,
  overlayColor = "primary",
  contentPosition = "center",
  minHeight = "large",
}: HeroOverlayProps) {
  const opacity = Math.max(0, Math.min(100, overlayOpacity)) / 100;
  return (
    <section
      data-nocms-component="hero-overlay"
      className={`relative w-full overflow-hidden ${minHeightMap[minHeight]}`}
    >
      <img
        data-role="media"
        src={backgroundImage}
        alt={imageAlt}
        className="absolute inset-0 z-0 h-full w-full object-cover"
        loading="eager"
      />
      <div
        aria-hidden="true"
        className={`absolute inset-0 z-[1] ${overlayBgMap[overlayColor]}`}
        style={{ opacity }}
      />
      <div
        className={`relative z-[2] flex h-full ${positionMap[contentPosition]} ${minHeightMap[minHeight]} px-6 py-16 sm:px-10 lg:px-16`}
      >
        <div className="max-w-3xl">
          <h1
            data-role="heading"
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {heading}
          </h1>
          {subheading && (
            <p
              data-role="subheading"
              className="font-body text-lg sm:text-xl text-white/90 leading-relaxed mb-8"
            >
              {subheading}
            </p>
          )}
          {(primaryCta || secondaryCta) && (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {primaryCta && (
                <a
                  href={primaryCta.href}
                  data-role="cta"
                  className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-md text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  {primaryCta.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              )}
              {secondaryCta && (
                <a
                  href={secondaryCta.href}
                  className="inline-flex items-center gap-2 border-2 border-white/50 text-white font-semibold px-8 py-4 rounded-md text-base hover:bg-white/10 transition-all"
                >
                  {secondaryCta.label}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
