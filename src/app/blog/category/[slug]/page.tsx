import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

type Params = { slug: string };
type Props = { params: Promise<Params> };

// Categories aren't part of the Payload `posts` schema yet. This route exists
// so existing inbound links don't 404; it renders a placeholder until a
// tags/category field is added to the collection.
export function generateStaticParams(): Params[] {
  return [{ slug: "_placeholder" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "_placeholder") return { title: "Category" };
  return { title: `${slug} | Blog category` };
}

export default async function BlogCategoryPage({ params }: Props) {
  const { slug } = await params;
  return (
    <>
      <section
        data-nocms-component="blog-category-header"
        className="bg-surface py-10 lg:py-14"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Blog", href: "/blog" },
              { label: "Categories", href: "/blog/category" },
              { label: slug },
            ]}
            className="mb-6"
          />
          <h1
            data-role="heading"
            className="font-heading text-4xl sm:text-5xl font-bold text-text capitalize"
          >
            {slug.replace(/-/g, " ")}
          </h1>
          <p data-role="subheading" className="mt-3 text-lg text-muted">
            Categories aren&apos;t configured yet.
          </p>
        </div>
      </section>
    </>
  );
}
