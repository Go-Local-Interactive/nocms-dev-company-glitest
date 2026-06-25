import * as React from "react";
import type { BlockProps } from "./types";
import { mediaUrl, mediaAlt } from "@/lib/payload";
import { lexicalToText } from "./Lexical";

/** Hero — legacy-faithful HomeHero port (storage-theme-payload/src/blocks/HomeHero).
 *
 *  Two CMS-driven layouts, both centred on a white content card holding the
 *  heading + subtitle + an inline location search:
 *  - FULL (default): full-width band; the photo is a DESKTOP-ONLY background
 *    (`hidden lg:block`). On mobile/tablet the photo is hidden and the band
 *    falls back to the brand `bg-primary-light` — matching the legacy
 *    `@media (max-width:1024px)` rule, not a darkened photo. The card aligns
 *    left/center/right per `settings.align`.
 *  - HALF (`settings.variant === "half"`): desktop 50/50 split — one half image,
 *    one half the content card. The image sits on the side named by
 *    `settings.align` (content-{left|right}); on mobile it collapses to the same
 *    stacked color-band layout as FULL.
 *
 *  `settings` is unpopulated for this tenant today, so the defaults (full +
 *  center) reproduce its current legacy hero; the migration will set `settings`
 *  later and re-import, and this renderer already honors it.
 *
 *  title → <h1> (dark text on the white card), body (first paragraph) →
 *  subtitle, media → bg image. Subfield attrs let the inspector pre-focus the
 *  right field in the editor. */
export function HeroBlock({ title, body, media, settings }: BlockProps) {
  const subheading = lexicalToText(body) || undefined;
  const bg = mediaUrl(media) ?? "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80";

  // Option → layout. Default full+center so the un-configured tenant matches legacy.
  const isHalf = settings?.variant === "half";
  const align = settings?.align === "left" || settings?.align === "right" ? settings.align : "center";
  // Half layout reads align as the IMAGE side (legacy content-{left|right}); it
  // has no "center", so center falls through to a left image / right content.
  const imageSide = align === "right" ? "right" : "left";

  const image = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      data-payload-subfield="media"
      src={bg}
      alt={mediaAlt(media)}
      loading="eager"
      className={
        isHalf
          ? // Half: occupies its grid half on desktop; hidden in the stacked mobile layout.
            "hidden lg:block lg:h-[562px] w-full object-cover"
          : // Full: absolute desktop-only background behind the card.
            "absolute inset-0 z-0 hidden h-full w-full object-cover lg:block"
      } data-role="media"
    />
  );

  const card = (
    /* Floating white card — dark text reads against the surface, not the photo. */
    <div
      className={[
        "relative z-[2] bg-background rounded-sm shadow-lg text-center",
        "w-full p-8 lg:w-auto lg:py-12 lg:px-20",
        isHalf ? "" : "lg:max-w-[800px]",
        // Full-layout desktop alignment (mobile is always centered/full-width).
        !isHalf && align === "center" ? "lg:mx-auto" : "",
        !isHalf && align === "left" ? "lg:ml-8 lg:mr-auto" : "",
        !isHalf && align === "right" ? "lg:mr-8 lg:ml-auto" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {title && (
        <h1
          data-role="heading"
          data-payload-subfield="title"
          // Caps at 36px (sm:text-4xl) to match legacy h1; leading-[1.05] mirrors its ~36px line-height.
          // m-0 (legacy h1 has zero margins) + default wrap — NOT text-wrap:balance, which breaks lines
          // differently than legacy.
          className="font-heading text-3xl sm:text-4xl font-bold text-text leading-[1.05] m-0"
        >
          {title}
        </h1>
      )}
      {subheading && (
        <p
          data-role="subheading"
          data-payload-subfield="body"
          className="font-body text-xl text-muted font-medium mt-3"
        >
          {subheading}
        </p>
      )}
      <HeroSearch />
    </div>
  );

  if (isHalf) {
    return (
      <section
        data-nocms-component="hero"
        className="relative w-full bg-primary-light h-fit lg:h-[562px] flex items-center lg:flex-row lg:items-stretch"
      >
        {/* On mobile both branches collapse to the centered card over the color band
            (the image is `hidden lg:block`). On desktop the order places the image
            on the configured side. */}
        {imageSide === "left" && <div className="lg:w-1/2 lg:shrink-0">{image}</div>}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-5 sm:p-8 lg:p-12">{card}</div>
        {imageSide === "right" && <div className="lg:w-1/2 lg:shrink-0">{image}</div>}
      </section>
    );
  }

  // FULL layout: justify the card per align on desktop; centered on mobile.
  const justify =
    align === "left" ? "lg:justify-start" : align === "right" ? "lg:justify-end" : "lg:justify-center";

  return (
    <section
      data-nocms-component="hero"
      className={`relative w-full overflow-hidden bg-primary-light h-fit lg:h-[562px] flex items-center justify-center px-5 py-10 sm:px-4 lg:px-0 ${justify}`}
    >
      {image}
      {card}
    </section>
  );
}

/** Inline location search row, matching the legacy HomeSearchForm visual layout:
 *  input + primary Search button, then "OR" + a "Near Me" button. Stacks on
 *  mobile (`flex-col`), inline on `sm`. Submits via GET to `/search?q=…`.
 *
 *  "Near Me" is geolocation in legacy; that's a follow-up. Here it's a same-form
 *  submit so it stays visually present and at least lands on the search page. */
function HeroSearch() {
  return (
    <form
      action="/search"
      method="get"
      role="search"
      className="mt-6 w-full max-w-[600px] mx-auto flex flex-col gap-2"
    >
      {/* Legacy renders a VISIBLE field label above the bar (16px / weight 500 / gray),
          left-aligned — not a placeholder and not sr-only. */}
      <label htmlFor="hero-search" className="text-left text-base font-medium text-muted" data-role="text">
        Zip or City, State
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        {/* Input + Search are a SPLIT pill: rounded outer ends, flat inner edges, 4px gap
            between them (legacy `gap` ≈ 4px). No in-field search icon (legacy has none). */}
        <div className="flex flex-1 items-stretch gap-1">
          <input
            id="hero-search"
            type="search"
            name="q"
            aria-label="Zip or City, State"
            // Filled neutral field (≈ legacy #D9DDE7), no border, rounded-left half-pill.
            className="flex-1 min-w-0 bg-black/[0.06] border-0 rounded-l-full px-5 py-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="submit"
            className="shrink-0 inline-flex items-center justify-center bg-primary text-white font-semibold px-8 py-3 rounded-r-full hover:opacity-90 transition" data-role="cta"
          >
            Search
          </button>
        </div>
        <div className="flex items-center justify-center gap-3 sm:gap-2">
          <span aria-hidden="true" className="text-text font-semibold" data-role="text-2">
            OR
          </span>
          <button
            type="submit"
            className="shrink-0 inline-flex items-center justify-center bg-primary-light text-text font-semibold px-6 py-3 rounded-full hover:opacity-90 transition whitespace-nowrap" data-role="cta-2"
          >
            Near Me
          </button>
        </div>
      </div>
    </form>
  );
}
