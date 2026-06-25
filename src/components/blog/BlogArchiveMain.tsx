import * as React from "react";
import { BlogCard, type BlogPost } from "@/components/blog/BlogCard";

/**
 * Main archive content — heading + grid of `BlogCard`s + pagination.
 * Source: storage-theme-payload `src/components/BlogArchiveMain`. Replaces
 * `PaginatedDocs<Post>` (Payload-specific) with a flat `BlogPost[]` plus
 * separate page/total/baseHref props; renders simple prev/next links instead
 * of the upstream's `Pagination` widget.
 *
 * Editor contract: section heading carries `data-role="heading"`. The grid
 * defers per-card roles to `BlogCard`.
 */

interface BlogArchiveMainProps {
  posts: BlogPost[];
  heading?: string;
  /** 1-based current page. */
  page?: number;
  totalPages?: number;
  /** Where pagination links navigate, e.g. `/blog/page/`. */
  baseHref?: string;
  baseSlug?: string;
}

export function BlogArchiveMain({
  posts,
  heading,
  page = 1,
  totalPages = 1,
  baseHref = "/blog/page/",
  baseSlug = "blog",
}: BlogArchiveMainProps) {
  return (
    <div data-nocms-component="blog-archive-main" className="flex-1">
      {heading && (
        <h2
          data-role="heading"
          className="font-heading text-2xl sm:text-3xl font-bold text-text mb-6"
        >
          {heading}
        </h2>
      )}
      {posts.length === 0 ? (
        <p role="status" className="text-zinc-600">
          No posts found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {posts.map((post, idx) => (
            <BlogCard key={post.slug} post={post} baseSlug={baseSlug} index={idx} />
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <nav
          aria-label="Blog posts pagination"
          className="mt-10 flex items-center justify-center gap-3 text-sm"
        >
          {page > 1 && (
            <a
              href={`${baseHref}${page - 1}`}
              className="px-3 py-2 rounded-md border border-zinc-300 hover:bg-zinc-50"
            >
              Previous
            </a>
          )}
          <span className="text-zinc-600">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <a
              href={`${baseHref}${page + 1}`}
              className="px-3 py-2 rounded-md border border-zinc-300 hover:bg-zinc-50"
            >
              Next
            </a>
          )}
        </nav>
      )}
    </div>
  );
}
