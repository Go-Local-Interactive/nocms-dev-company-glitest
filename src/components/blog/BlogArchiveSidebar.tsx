import * as React from "react";
import { BlogSearch } from "@/components/blog/BlogSearch";
import { HorizontalRule } from "@/components/ui/HorizontalRule";
import type { BlogPost } from "@/components/blog/BlogCard";

/**
 * Blog archive sidebar — search box + recent-posts list + optional categories.
 * Source: storage-theme-payload `src/components/BlogArchiveSidebar`. Replaces
 * the Payload-typed `BlogCardPostData` with the local flat `BlogPost` shape;
 * recent posts are passed as a prop instead of fetched server-side.
 *
 * Editor contract: section heading carries `data-role="heading"`.
 */

interface BlogArchiveSidebarProps {
  recentPosts?: BlogPost[];
  categories?: { name: string; slug: string }[];
  baseSlug?: string;
}

export function BlogArchiveSidebar({
  recentPosts = [],
  categories = [],
  baseSlug = "blog",
}: BlogArchiveSidebarProps) {
  return (
    <aside
      data-nocms-component="blog-archive-sidebar"
      aria-labelledby="sidebar-heading"
      className="w-full lg:w-72 lg:flex-shrink-0 space-y-6"
    >
      <h2 id="sidebar-heading" className="sr-only">
        Blog Sidebar
      </h2>
      <BlogSearch />
      {categories.length > 0 && (
        <>
          <HorizontalRule enableGutter={false} />
          <section aria-labelledby="categories-heading">
            <h3
              id="categories-heading"
              className="font-heading text-lg font-bold text-text mb-3"
            >
              Categories
            </h3>
            <ul className="space-y-1.5 text-sm">
              {categories.map((c) => (
                <li key={c.slug}>
                  <a
                    href={`/${baseSlug}/category/${c.slug}`}
                    className="text-zinc-600 hover:text-primary"
                  >
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
      {recentPosts.length > 0 && (
        <>
          <HorizontalRule enableGutter={false} />
          <section aria-labelledby="recent-heading">
            <h3
              id="recent-heading"
              data-role="heading"
              className="font-heading text-lg font-bold text-text mb-3"
            >
              Recent Posts
            </h3>
            <ul className="space-y-3">
              {recentPosts.map((post) => (
                <li key={post.slug}>
                  <a
                    href={`/${baseSlug}/${post.slug}`}
                    className="block group text-sm"
                  >
                    <span className="font-semibold text-text group-hover:text-primary">
                      {post.title}
                    </span>
                    {post.publishedAt && (
                      <span className="block text-xs text-zinc-500 mt-0.5">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </aside>
  );
}
