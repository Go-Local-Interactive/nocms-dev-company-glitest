import * as React from "react";
import { BlogCard, type BlogPost } from "@/components/blog/BlogCard";

/**
 * Featured article hero — a single, prominently-sized `BlogCard`. Source:
 * storage-theme-payload `src/components/BlogFeaturedArticle`. Same shape as
 * `BlogCard` but rendered with the `isFeatured` flag (wider layout, larger
 * type) and wrapped in a section header.
 *
 * Editor contract: `data-nocms-component` only — `BlogCard` owns the inner
 * heading/subheading/cta/media roles.
 */

interface BlogFeaturedArticleProps {
  post: BlogPost;
  showExcerpt?: boolean;
  baseSlug?: string;
}

export function BlogFeaturedArticle({
  post,
  showExcerpt = true,
  baseSlug = "blog",
}: BlogFeaturedArticleProps) {
  return (
    <section
      data-nocms-component="blog-featured-article"
      aria-label="Featured Article"
      className="py-12 lg:py-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="sr-only">Featured Article</h2>
        <BlogCard
          post={post}
          baseSlug={baseSlug}
          showExcerpt={showExcerpt}
          index={0}
          isFeatured
        />
      </div>
    </section>
  );
}
