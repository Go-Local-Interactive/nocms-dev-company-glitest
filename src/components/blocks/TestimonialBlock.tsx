import * as React from "react";
import { Quote, Star } from "lucide-react";
import type { BlockProps, LexicalNode, LexicalRoot } from "./types";
import { lexicalToText } from "./Lexical";
import { fetchLocations, fetchTenantServerKey } from "@/lib/payload";
import { fetchGoogleReviews, type GoogleReview } from "@/lib/reviews";

/** A single parsed review card. */
interface Review {
  author: string;
  quote: string;
  rating: number;
}

/** Pull plain text out of a single lexical node (text + nested children). */
function nodeText(node: LexicalNode): string {
  const out: string[] = [];
  const walk = (n: LexicalNode) => {
    if (n.type === "text" && typeof n.text === "string") out.push(n.text);
    n.children?.forEach(walk);
  };
  walk(node);
  return out.join(" ").trim();
}

/** Parse a leading "★ N" rating paragraph (the migration encodes per-review
 *  ratings this way). Returns the numeric rating, or null when not a rating. */
function parseRating(text: string): number | null {
  const m = text.match(/^★\s*([0-9]+(?:\.[0-9]+)?)/);
  return m ? Number(m[1]) : null;
}

/** Split the testimonial body into review cards. The corporateReviews migration
 *  emits one group per review: an h3 author line, a "★ N" rating paragraph, and
 *  the quote paragraph. A new card starts at each heading. Returns [] when the
 *  body has no headings (the legacy single-testimonial shape). */
function parseReviews(body?: LexicalRoot | null): Review[] {
  const children = body?.root?.children;
  if (!children?.length) return [];
  const reviews: Review[] = [];
  let current: Review | null = null;
  for (const node of children) {
    if (node.type === "heading") {
      current = { author: nodeText(node), quote: "", rating: 0 };
      reviews.push(current);
      continue;
    }
    if (!current) continue;
    const t = nodeText(node);
    const rating = parseRating(t);
    if (rating !== null) current.rating = rating;
    else if (t) current.quote = current.quote ? `${current.quote} ${t}` : t;
  }
  return reviews.filter((r) => r.quote || r.author);
}

/** A 0–5 star row. Renders filled stars up to `rating` (rounded), the rest muted. */
function Stars({ rating }: { rating: number }) {
  const filled = Math.round(Math.max(0, Math.min(5, rating)));
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`} data-nocms-component="testimonial-block">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          className={
            i < filled
              ? "h-5 w-5 fill-amber-400 text-amber-400"
              : "h-5 w-5 fill-text/10 text-text/20"
          }
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

/** A single white review card — stars, quote, author/source footer. */
function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="flex h-full flex-col rounded-xl bg-background p-6 sm:p-8 shadow-sm">
      <div className="mb-4">
        <Stars rating={review.rating} />
      </div>
      {review.quote && (
        <p className="font-body text-base text-text leading-relaxed mb-6" data-role="subheading">
          {review.quote}
        </p>
      )}
      {review.author && (
        <div className="mt-auto flex items-center gap-3">
          <Quote className="h-5 w-5 shrink-0 text-primary/40" aria-hidden="true" />
          <p className="font-body text-sm font-semibold text-muted">{review.author}</p>
        </div>
      )}
    </article>
  );
}

/** Short bold headline from a review's opening words (legacy shows e.g.
 *  "I've never had a single…"). */
function headline(text: string, words = 5): string {
  const w = text.trim().split(/\s+/);
  return w.length <= words ? text.trim() : `${w.slice(0, words).join(" ")}…`;
}

/** A live Google-review card — gold stars, truncated headline, the review text,
 *  and a footer with a primary quote badge + author + relative time. Matches the
 *  legacy CorporateReviews card. */
function GoogleReviewCard({ review }: { review: GoogleReview }) {
  return (
    <article className="flex h-full flex-col rounded-xl bg-background p-6 sm:p-8 shadow-sm">
      <Stars rating={review.rating} />
      <h3 className="font-heading text-base font-bold text-text mt-4 mb-2" data-role="heading">
        {headline(review.text)}
      </h3>
      <p className="font-body text-base text-text/80 leading-relaxed line-clamp-4" data-role="subheading-2">
        {review.text}
      </p>
      <div className="mt-auto flex items-center gap-3 pt-6">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary"
          aria-hidden="true"
        >
          <Quote className="h-4 w-4 fill-white text-white" />
        </span>
        <span className="font-body text-sm font-semibold text-text">{review.author}</span>
        {review.relativeTime && (
          <span className="font-body text-sm text-muted">{review.relativeTime}</span>
        )}
      </div>
    </article>
  );
}

/** Live "What Our Customers Are Saying": pull up to 4 Google reviews from the
 *  tenant's facilities (those with a Place ID) server-side, render legacy's
 *  lavender 2×2 grid. Returns null when there's no server key / no reviews. */
/** Pure presentational reviews grid (legacy lavender 2×2) — fixture-renderable. */
export function ReviewsView({
  title,
  reviews,
}: {
  title?: string | null;
  reviews: GoogleReview[];
}) {
  if (reviews.length === 0) return null;
  return (
    <section
      data-nocms-component="testimonial"
      className="bg-primary-light py-16 sm:py-20 px-6 sm:px-10 lg:px-16"
    >
      <div className="max-w-6xl mx-auto">
        {title && (
          <h2
            data-payload-subfield="title"
            className="font-heading text-2xl sm:text-4xl font-bold text-text text-center mb-10 sm:mb-12"
            style={{ textWrap: "balance" } as React.CSSProperties} data-role="heading-2"
          >
            {title}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((r, i) => (
            <GoogleReviewCard key={i} review={r} />
          ))}
        </div>
      </div>
    </section>
  );
}

async function LiveReviews({ title }: { title?: string | null }) {
  const [locations, serverKey] = await Promise.all([
    fetchLocations(300),
    fetchTenantServerKey(),
  ]);
  const placeIds = locations
    .filter((l) => l.locationType === "single" && l.googlePlaceId)
    .map((l) => l.googlePlaceId as string);
  const reviews = await fetchGoogleReviews(placeIds, serverKey);
  return <ReviewsView title={title} reviews={reviews} />;
}

/** Testimonial block. Three shapes:
 *  - Live corporate reviews (`settings.variant === "google-reviews"`): fetches
 *    Google reviews server-side from the tenant's facilities (legacy parity).
 *  - Stored reviews: the migration encoded multiple reviews into the body
 *    (heading=author, "★ N"=rating, quote) — render a card grid.
 *  - Single testimonial: body is one quote (+ author/rating); centered layout. */
export async function TestimonialBlock({ title, body, rating, settings }: BlockProps) {
  const reviews = parseReviews(body);

  // Live Google reviews take over only when no reviews were stored in the body.
  if (reviews.length === 0 && settings?.variant === "google-reviews") {
    return <LiveReviews title={title} />;
  }

  if (reviews.length > 0) {
    return (
      <section
        data-nocms-component="testimonial"
        className="bg-primary/5 py-16 sm:py-20 px-6 sm:px-10 lg:px-16"
      >
        <div className="max-w-6xl mx-auto">
          {title && (
            <h2
              data-payload-subfield="title"
              className="font-heading text-2xl sm:text-4xl font-bold text-text text-center mb-10 sm:mb-12"
              style={{ textWrap: "balance" } as React.CSSProperties} data-role="heading-3"
            >
              {title}
            </h2>
          )}
          <div
            data-payload-subfield="body"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {reviews.map((r, i) => (
              <ReviewCard key={i} review={r} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Single-testimonial fallback (legacy `singleTestimonial`).
  const quote = lexicalToText(body);
  if (!quote) return null;
  const stars = typeof rating === "number" ? Math.round(Math.max(0, Math.min(5, rating))) : 5;
  return (
    <section data-nocms-component="testimonial" className="bg-background py-20 px-6 sm:px-10 lg:px-16">
      <div className="max-w-3xl mx-auto text-center">
        <Quote className="h-10 w-10 text-primary/30 mx-auto mb-6" aria-hidden="true" />
        <p
          data-payload-subfield="body"
          className="font-heading text-2xl sm:text-3xl text-text leading-relaxed mb-8"
          style={{ textWrap: "balance" } as React.CSSProperties} data-role="subheading-3"
        >
          &ldquo;{quote}&rdquo;
        </p>
        <div className="flex items-center justify-center gap-1 mb-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star
              key={i}
              className={
                i < stars
                  ? "h-5 w-5 fill-amber-400 text-amber-400"
                  : "h-5 w-5 fill-text/10 text-text/20"
              }
              aria-hidden="true"
            />
          ))}
        </div>
        {title && (
          <p data-payload-subfield="title" className="font-body text-base font-semibold text-muted" data-role="subheading-4">
            {title}
          </p>
        )}
      </div>
    </section>
  );
}
