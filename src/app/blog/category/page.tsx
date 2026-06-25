import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import skinConfig from "@/skin.config";

export const metadata: Metadata = {
  title: `Blog categories | ${skinConfig.brandName}`,
  description: "Browse storage articles by category.",
};

// Categories aren't part of the Payload `posts` schema yet. Add a tags/category
// field on the collection and wire it through here when needed.
export default function BlogCategoryIndexPage() {
  return (
    <>
      <section
        data-nocms-component="blog-category-header"
        className="bg-surface py-10 lg:py-14"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[{ label: "Blog", href: "/blog" }, { label: "Categories" }]}
            className="mb-6"
          />
          <h1
            data-role="heading"
            className="font-heading text-4xl sm:text-5xl font-bold text-text"
          >
            Blog categories
          </h1>
          <p data-role="subheading" className="mt-3 text-lg text-muted max-w-2xl">
            Categories aren&apos;t configured yet.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-background">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-muted" data-role="text">
            Add a tags or category field to your blog posts in the CMS to see them here.
          </p>
        </div>
      </section>
    </>
  );
}
