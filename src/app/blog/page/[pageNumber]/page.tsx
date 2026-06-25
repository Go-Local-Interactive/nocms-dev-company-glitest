import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BlogArchiveWrapper } from "@/components/blog/BlogArchiveWrapper";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { fetchPosts, toCardPost } from "@/lib/payload";

type Params = { pageNumber: string };
type Props = { params: Promise<Params> };

const POSTS_PER_PAGE = 5;

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await fetchPosts(200);
  if (posts.length <= 1) return [{ pageNumber: "_placeholder" }];
  const totalPages = Math.max(1, Math.ceil((posts.length - 1) / POSTS_PER_PAGE));
  const out: Params[] = [];
  for (let i = 2; i <= totalPages; i++) out.push({ pageNumber: String(i) });
  if (out.length === 0) return [{ pageNumber: "_placeholder" }];
  return out;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pageNumber } = await params;
  return { title: `Blog — page ${pageNumber}` };
}

export default async function BlogListPaginatedPage({ params }: Props) {
  const { pageNumber } = await params;
  if (pageNumber === "_placeholder") {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight" data-role="heading-2">Blog</h1>
        <p className="mt-4 text-zinc-600" data-role="text">More posts coming soon.</p>
      </main>
    );
  }

  const page = Number(pageNumber);
  const posts = await fetchPosts(200);
  const totalPages = Math.max(1, Math.ceil((posts.length - 1) / POSTS_PER_PAGE));
  if (!Number.isInteger(page) || page < 2 || page > totalPages) notFound();

  const cardPosts = posts.map(toCardPost);
  const start = 1 + (page - 1) * POSTS_PER_PAGE;
  const slice = cardPosts.slice(start, start + POSTS_PER_PAGE);

  return (
    <>
      <section
        data-nocms-component="blog-paginated-header"
        className="bg-surface py-10 lg:py-14"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[{ label: "Blog", href: "/blog" }, { label: `Page ${page}` }]}
            className="mb-6"
          />
          <h1
            data-role="heading"
            className="font-heading text-4xl sm:text-5xl font-bold text-text"
          >
            Blog — page {page}
          </h1>
        </div>
      </section>

      <BlogArchiveWrapper
        posts={slice}
        heading={`Page ${page} of ${totalPages}`}
        page={page}
        totalPages={totalPages}
        baseHref="/blog/page/"
        baseSlug="blog"
        recentPosts={cardPosts.slice(0, 5)}
      />
    </>
  );
}
