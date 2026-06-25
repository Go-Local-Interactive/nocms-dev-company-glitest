import * as React from "react";
import { BlogArchiveMain } from "@/components/blog/BlogArchiveMain";
import { BlogArchiveSidebar } from "@/components/blog/BlogArchiveSidebar";
import type { BlogPost } from "@/components/blog/BlogCard";

/**
 * Layout wrapper for the blog archive — main content + sidebar in a
 * responsive two-column layout. Source: storage-theme-payload
 * `src/components/BlogArchiveWrapper`. Replaces the server-side
 * `fetchRecentPosts` call with a `recentPosts` prop so the wrapper stays a
 * pure presentational component.
 *
 * Editor contract: `data-nocms-component` only — child components own roles.
 */

interface BlogArchiveWrapperProps {
  posts: BlogPost[];
  heading?: string;
  page?: number;
  totalPages?: number;
  baseHref?: string;
  baseSlug?: string;
  recentPosts?: BlogPost[];
  categories?: { name: string; slug: string }[];
}

export function BlogArchiveWrapper({
  posts,
  heading,
  page,
  totalPages,
  baseHref,
  baseSlug = "blog",
  recentPosts = [],
  categories = [],
}: BlogArchiveWrapperProps) {
  return (
    <div
      data-nocms-component="blog-archive-wrapper"
      className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16"
    >
      <div className="flex flex-col lg:flex-row gap-10">
        <BlogArchiveMain
          posts={posts}
          heading={heading}
          page={page}
          totalPages={totalPages}
          baseHref={baseHref}
          baseSlug={baseSlug}
        />
        <BlogArchiveSidebar
          recentPosts={recentPosts}
          categories={categories}
          baseSlug={baseSlug}
        />
      </div>
    </div>
  );
}
