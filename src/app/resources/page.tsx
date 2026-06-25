import type { Metadata } from "next";
import { ArrowRight, BookOpen, HelpCircle, Calculator } from "lucide-react";
import { CTABanner } from "@/components/content/CTABanner";
import { fetchPageBySlug } from "@/lib/payload";
import { PageDocument, pageDocumentMetadata } from "@/components/blocks/PageDocument";
import skinConfig from "@/skin.config";

// Tenant override: an imported legacy page with this exact slug (e.g. a
// migrated `/resources`) wins over the template's demo content, keeping the
// legacy URL intact. With `output: "export"` the check runs at build time —
// a fresh deploy is the invalidation trigger.
const PAGE_SLUG = "resources";

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchPageBySlug(PAGE_SLUG);
  if (page) return pageDocumentMetadata(page);
  return {
    title: `Resources | ${skinConfig.brandName}`,
    description: `Storage guides, articles, and tools from ${skinConfig.brandName}.`,
  };
}

const resourceCards = [
  {
    title: "Blog",
    description: "Tips, guides, and stories about packing, moving, and self-storage.",
    href: "/blog",
    icon: BookOpen,
  },
  {
    title: "Size guide",
    description: "Compare sizes side-by-side and pick the right unit for what you're storing.",
    href: "/reserve-online",
    icon: Calculator,
  },
  {
    title: "Search",
    description: "Find a specific location, article, or resource on the site.",
    href: "/search",
    icon: HelpCircle,
  },
];

export default async function ResourcesPage() {
  const page = await fetchPageBySlug(PAGE_SLUG);
  if (page) return <PageDocument page={page} />;

  return (
    <>
      <section
        data-nocms-component="resources-hero"
        className="bg-primary py-16 lg:py-20 text-center text-white"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1
            data-role="heading"
            className="font-heading text-4xl sm:text-5xl font-bold leading-tight"
          >
            Storage resources
          </h1>
          <p data-role="subheading" className="mt-4 text-lg text-white/85">
            Guides, articles, and tools to help you get the most out of your unit.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resourceCards.map((card) => (
              <a
                key={card.href}
                href={card.href}
                className="group block bg-surface rounded-xl p-8 border border-text/5 hover:border-primary hover:shadow-md transition-all"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                  <card.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h2 className="font-heading text-xl font-bold text-text mb-2 group-hover:text-primary transition-colors">
                  {card.title}
                </h2>
                <p className="text-muted text-sm leading-relaxed mb-4">
                  {card.description}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                  Open
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        heading="Have a question we didn't cover?"
        subheading="Our office team is happy to help."
        primaryCta={{ label: "Contact us", href: "/contact" }}
        phone={skinConfig.contactPhone}
      />
    </>
  );
}
