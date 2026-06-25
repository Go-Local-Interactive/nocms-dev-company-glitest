import type { Metadata } from "next";
import { BlogArchiveWrapper } from "@/components/blog/BlogArchiveWrapper";
import { BlogFeaturedArticle } from "@/components/blog/BlogFeaturedArticle";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { RenderBlocks } from "@/components/blocks/RenderBlocks";
import { payloadFieldAttrs } from "@/lib/payload-attrs";
import skinConfig from "@/skin.config";
import { fetchPageBySlug, fetchPosts, toCardPost } from "@/lib/payload";

const BLOG_INDEX_SLUG = "blog";
const POSTS_PER_PAGE = 5;

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchPageBySlug(BLOG_INDEX_SLUG);
  return {
    title: page?.meta?.title ?? `Blog | ${skinConfig.brandName}`,
    description:
      page?.meta?.description ??
      `Articles, tips, and guides about self-storage from ${skinConfig.brandName}.`,
  };
}

export default async function BlogIndexPage() {
  const [page, posts] = await Promise.all([fetchPageBySlug(BLOG_INDEX_SLUG), fetchPosts()]);
  const cardPosts = posts.map(toCardPost);
  const featured = cardPosts[0];
  const rest = cardPosts.slice(1, POSTS_PER_PAGE);
  const totalPages = Math.max(1, Math.ceil((cardPosts.length - 1) / POSTS_PER_PAGE));

  const headerBlocks = page?.blocks ?? [];

  return (
    <>
      {headerBlocks.length > 0 ? (
        <RenderBlocks blocks={headerBlocks} docId={page!.id} blocksField="blocks" />
      ) : (
        <section
          data-nocms-component="blog-header"
          className="bg-surface py-10 lg:py-14"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={[{ label: "Blog" }]} className="mb-6" />
            <h1
              {...(page
                ? payloadFieldAttrs({ collection: "pages", docId: page.id, field: "title" })
                : {})}
              data-role="heading"
              className="font-heading text-4xl sm:text-5xl font-bold text-text"
            >
              {page?.title ?? `${skinConfig.brandName} blog`}
            </h1>
            <p data-role="subheading" className="mt-3 text-lg text-muted max-w-2xl">
              {page?.meta?.description ??
                "Tips, guides, and stories about packing, moving, and getting the most out of self-storage."}
            </p>
          </div>
        </section>
      )}

      {featured && <BlogFeaturedArticle post={featured} baseSlug="blog" />}

      <BlogArchiveWrapper
        posts={rest}
        heading="Latest articles"
        page={1}
        totalPages={totalPages}
        baseHref="/blog/page/"
        baseSlug="blog"
        recentPosts={cardPosts.slice(0, 5)}
      />
    </>
  );
}
