import * as React from "react";
import { ArrowRight } from "lucide-react";

/**
 * Single blog post tile. Source: storage-theme-payload `src/components/BlogCard`.
 * The Lexical content extraction + Payload media-size variants are dropped —
 * this version takes a flat `BlogPost` shape with already-resolved excerpt and
 * cover image URL.
 *
 * Editor contract: title carries `data-role="heading"`, excerpt carries
 * `data-role="subheading"`, cover image carries `data-role="media"`,
 * the "Read more" link carries `data-role="cta"`.
 */

export interface BlogPost {
  slug: string;
  title: string;
  excerpt?: string;
  publishedAt?: string;
  /** Already-resolved cover image URL (no Payload media object). */
  coverImage?: { src: string; alt?: string };
  /** Optional category label shown above the title. */
  category?: string;
}

interface BlogCardProps {
  post: BlogPost;
  baseSlug?: string;
  showExcerpt?: boolean;
  /** When true, renders larger / featured-tile dimensions. */
  isFeatured?: boolean;
  index?: number;
  className?: string;
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDate(timestamp: string): { day: string; month: string } | null {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return null;
  return {
    day: date.getDate().toString().padStart(2, "0"),
    month: months[date.getMonth()] ?? "",
  };
}

export function BlogCard({
  post,
  baseSlug = "blog",
  showExcerpt = true,
  isFeatured = false,
  index,
  className = "",
}: BlogCardProps) {
  const href = `/${baseSlug}/${post.slug}`;
  const date = post.publishedAt ? formatDate(post.publishedAt) : null;
  const eager = index === 0;

  return (
    <article
      data-nocms-component="blog-card"
      className={`group rounded-xl bg-white border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
        isFeatured ? "lg:flex" : ""
      } ${className}`}
      aria-label={`Card for ${post.title}`}
    >
      {post.coverImage && (
        <div
          className={`relative ${isFeatured ? "lg:w-1/2 aspect-video lg:aspect-auto" : "aspect-[16/10]"} overflow-hidden bg-zinc-100`}
        >
          <img
            data-role="media"
            src={post.coverImage.src}
            alt={post.coverImage.alt ?? ""}
            className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading={eager ? "eager" : "lazy"}
          />
          {date && (
            <div
              aria-hidden="true"
              className="absolute top-3 left-3 bg-white rounded-md px-3 py-1.5 shadow-md text-center"
            >
              <div className="text-base font-bold text-primary leading-none">
                {date.day}
              </div>
              <div className="text-[10px] uppercase tracking-wide text-zinc-500">
                {date.month}
              </div>
            </div>
          )}
        </div>
      )}
      <div className={`p-5 ${isFeatured ? "lg:w-1/2 lg:p-8 flex flex-col justify-center" : ""}`}>
        {post.category && (
          <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">
            {post.category}
          </p>
        )}
        <h3
          data-role="heading"
          className={`font-heading font-bold text-text ${isFeatured ? "text-2xl sm:text-3xl mb-3" : "text-lg mb-2"}`}
        >
          <a href={href} className="hover:text-primary transition-colors">
            {post.title}
          </a>
        </h3>
        {showExcerpt && post.excerpt && (
          <p data-role="subheading" className="text-zinc-600 text-sm mb-4">
            {post.excerpt}
          </p>
        )}
        <a
          href={href}
          data-role="cta"
          className="inline-flex items-center gap-1 text-primary font-semibold text-sm hover:gap-2 transition-all"
        >
          Read more
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
