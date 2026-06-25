import * as React from "react";
import { ArrowRight } from "lucide-react";
import type { BlockProps } from "./types";
import { fetchPosts, mediaUrl, mediaAlt } from "@/lib/payload";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Split a post's published date into a day/month pair for the corner badge.
 *  Returns null for an unparseable/empty date so the badge is simply omitted. */
function dateBadge(value: string | undefined | null): { day: string; month: string } | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return { day: String(d.getDate()).padStart(2, "0"), month: MONTHS[d.getMonth()] };
}

/** Blog archive ("From the Blog") — heading over a row of post cards. Each card
 *  mirrors legacy: a square date badge overlapping the cover image's top-left, a
 *  16:9 cover, and a linked title. 4-up on desktop, 2-up tablet, stacked mobile,
 *  with a "More From the Blog" affordance below. Self-fetches recent posts
 *  (renderer-only — no migration change). Async server component. */
export async function BlogArchiveBlock({ title }: BlockProps) {
  const posts = await fetchPosts(4);
  return (
    <section data-nocms-component="blog-archive" className="bg-surface py-12 px-6 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {title && (
          <h2
            data-payload-subfield="title"
            className="font-heading text-[1.75rem] font-bold text-text text-center mb-8"
            style={{ textWrap: "balance" } as React.CSSProperties} data-role="heading"
          >
            {title}
          </h2>
        )}
        {posts.length === 0 ? (
          <p className="text-center text-muted" data-role="text">No posts yet.</p>
        ) : (
          <>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 w-full">
              {posts.map((p) => {
                const cover = mediaUrl(p.featuredImage);
                const badge = dateBadge(p.publishedAt ?? p.updatedAt);
                return (
                  <li
                    key={p.id}
                    className="relative bg-background rounded-lg hover:shadow-lg transition-shadow duration-200 flex flex-col"
                  >
                    <div className="relative aspect-[16/9] min-h-[200px] rounded-t-lg overflow-hidden bg-text/5">
                      {cover && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={cover}
                          alt={mediaAlt(p.featuredImage) || p.title}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover" data-role="media"
                        />
                      )}
                    </div>
                    {badge && (
                      <div
                        className="absolute -top-6 left-6 z-10 flex h-[75px] w-[75px] flex-col items-center justify-center bg-primary text-white text-center"
                        aria-label={`Posted on ${badge.month} ${badge.day}`}
                        role="text"
                      >
                        <span className="text-3xl font-bold leading-none">{badge.day}</span>
                        <span className="text-base font-medium">{badge.month}</span>
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-heading text-2xl font-semibold text-text leading-tight" data-role="heading-2">
                        <a href={`/blog/${p.slug}`} className="after:absolute after:inset-0 hover:underline">
                          {p.title}
                        </a>
                      </h3>
                    </div>
                  </li>
                );
              })}
            </ul>
            <a
              href="/blog"
              className="mt-12 inline-flex items-center gap-2 bg-primary text-white font-bold px-4 py-2 rounded-full hover:opacity-90 transition" data-role="cta"
            >
              More From the Blog <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </>
        )}
      </div>
    </section>
  );
}
