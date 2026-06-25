import * as React from "react";
import { ArrowRight } from "lucide-react";
import type { BlockProps } from "./types";
import { fetchPosts, mediaUrl, mediaAlt } from "@/lib/payload";

/** Blog archive — fetches recent posts from /cms/api/posts. Async server component. */
export async function BlogArchiveBlock({ title }: BlockProps) {
  const posts = await fetchPosts(3);
  return (
    <section data-nocms-component="blog-archive" className="bg-surface py-20 px-6 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {title && (
          <h2
            data-payload-subfield="title"
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-text text-center mb-16"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {title}
          </h2>
        )}
        {posts.length === 0 ? (
          <p className="text-center text-muted">No posts yet.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((p) => {
              const cover = mediaUrl(p.featuredImage);
              return (
                <li key={p.id} className="bg-background rounded-xl border border-text/10 overflow-hidden shadow-sm hover:shadow-md transition">
                  {cover && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={cover} alt={mediaAlt(p.featuredImage)} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-6">
                    <h3 className="font-heading text-xl font-semibold text-text mb-3">{p.title}</h3>
                    {p.excerpt && <p className="font-body text-base text-muted mb-4">{p.excerpt}</p>}
                    <a href={`/blog/${p.slug}`} className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:gap-2 transition-all">
                      Read more <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
