import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { fetchPosts, fetchPostBySlug, mediaUrl, mediaAlt } from "@/lib/payload";
import { LexicalRichText } from "@/lib/lexical-to-html";
import { payloadDocAttrs, payloadFieldAttrs } from "@/lib/payload-attrs";

type Params = { slug: string };
type Props = { params: Promise<Params> };

export const dynamic = "force-static";

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await fetchPosts(200);
  if (posts.length === 0) return [{ slug: "_placeholder" }];
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "_placeholder") return { title: "Blog" };
  const post = await fetchPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.meta?.title ?? `${post.title} | Blog`,
    description: post.meta?.description ?? post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  if (slug === "_placeholder") {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight" data-role="heading-2">Blog</h1>
        <p className="mt-4 text-zinc-600" data-role="text">No posts yet.</p>
      </main>
    );
  }
  const post = await fetchPostBySlug(slug);
  if (!post) notFound();

  const cover = mediaUrl(post.featuredImage);
  const coverAlt = mediaAlt(post.featuredImage) || post.title;
  const dateLabel = (post.publishedAt ?? post.updatedAt) || "";

  const docAttrs = payloadDocAttrs({ collection: "posts", docId: post.id });

  return (
    <article
      data-nocms-component="blog-post"
      {...docAttrs}
      className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16"
    >
      <Breadcrumbs
        items={[{ label: "Blog", href: "/blog" }, { label: post.title }]}
        className="mb-6"
      />
      {cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          data-role="media"
          {...payloadFieldAttrs({ collection: "posts", docId: post.id, field: "featuredImage" })}
          src={cover}
          alt={coverAlt}
          className="w-full h-72 object-cover rounded-xl mb-8"
        />
      )}
      <h1
        data-role="heading"
        {...payloadFieldAttrs({ collection: "posts", docId: post.id, field: "title" })}
        className="font-heading text-4xl sm:text-5xl font-bold text-text leading-tight"
      >
        {post.title}
      </h1>
      {dateLabel && (
        <p
          data-role="subheading"
          {...payloadFieldAttrs({ collection: "posts", docId: post.id, field: "publishedAt" })}
          className="mt-3 text-muted"
        >
          {new Date(dateLabel).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}
      {post.excerpt && (
        <p
          {...payloadFieldAttrs({ collection: "posts", docId: post.id, field: "excerpt" })}
          className="mt-4 text-lg text-muted" data-role="subheading-2"
        >
          {post.excerpt}
        </p>
      )}
      <div {...payloadFieldAttrs({ collection: "posts", docId: post.id, field: "content" })}>
        <LexicalRichText
          value={post.content}
          className="mt-8 text-text leading-relaxed prose prose-lg max-w-none"
        />
      </div>
      <div className="mt-12 pt-8 border-t border-text/10">
        <a
          data-role="cta"
          href="/blog"
          className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
        >
          ← Back to all articles
        </a>
      </div>
    </article>
  );
}
