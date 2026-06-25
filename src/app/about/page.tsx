import type { Metadata } from "next";
import { ShieldCheck, Snowflake, Truck, Building2, Heart, Users } from "lucide-react";
import { CTABanner } from "@/components/content/CTABanner";
import { fetchPageBySlug } from "@/lib/payload";
import { PageDocument, pageDocumentMetadata } from "@/components/blocks/PageDocument";
import skinConfig from "@/skin.config";

// Tenant override: an imported legacy page with this exact slug (e.g. a
// migrated `/about`) wins over the template's demo content, keeping the
// legacy URL intact. With `output: "export"` the check runs at build time —
// a fresh deploy is the invalidation trigger.
const PAGE_SLUG = "about";

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchPageBySlug(PAGE_SLUG);
  if (page) return pageDocumentMetadata(page);
  return {
    title: `About | ${skinConfig.brandName}`,
    description: `Learn about ${skinConfig.brandName} — locally owned, climate-controlled, and built for the long haul.`,
  };
}

const values = [
  {
    icon: ShieldCheck,
    title: "Security first",
    description:
      "Gated access, 24/7 surveillance, and on-site management at every facility. Your stuff stays where you put it.",
  },
  {
    icon: Snowflake,
    title: "Climate control",
    description:
      "Stable temperature and humidity for the things that matter — antiques, electronics, photos, and instruments.",
  },
  {
    icon: Truck,
    title: "Easy move-in",
    description:
      "Drive-up units, free move-in trucks, and same-day rentals so the day of the move is the easy part.",
  },
  {
    icon: Building2,
    title: "Built for storage",
    description:
      "Purpose-built facilities with wide drive aisles, tall ceilings, and modern construction — not converted warehouses.",
  },
  {
    icon: Heart,
    title: "Locally owned",
    description:
      "Independent and community-rooted. Your money stays in town and your manager actually picks up the phone.",
  },
  {
    icon: Users,
    title: "Real people",
    description:
      "Live managers on every property — not call centers, not chatbots. The same face every visit.",
  },
];

export default async function AboutPage() {
  const page = await fetchPageBySlug(PAGE_SLUG);
  if (page) return <PageDocument page={page} />;

  return (
    <>
      <section
        data-nocms-component="about-hero"
        className="bg-primary py-16 lg:py-20 text-center text-white"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1
            data-role="heading"
            className="font-heading text-4xl sm:text-5xl font-bold leading-tight"
          >
            About {skinConfig.brandName}
          </h1>
          <p data-role="subheading" className="mt-4 text-lg text-white/85">
            Self-storage built for the way you actually use it.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-background">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text mb-6" data-role="heading-2">
            Our story
          </h2>
          <div className="text-lg text-muted leading-relaxed space-y-5 text-left">
            <p data-role="text">
              {skinConfig.brandName} started with a simple idea: most storage facilities are
              afterthoughts — converted warehouses, dim hallways, faceless leasing offices. We
              wanted something different. Purpose-built buildings with wide drive aisles, real
              climate control, and a manager who recognizes you.
            </p>
            <p data-role="text-2">
              Today we serve hundreds of customers across the metro. Personal storage during a
              renovation, business inventory for a growing online shop, vehicle parking through the
              winter — whatever you&apos;re storing, we&apos;ve probably stored something like it
              before.
            </p>
            <p data-role="text-3">
              We&apos;re locally owned, month-to-month by default, and we never charge fees for
              things that should be free. That&apos;s the whole pitch.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-surface">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-text text-center mb-12" data-role="heading-3">
            What sets us apart
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-background rounded-xl p-8 border border-text/5 hover:shadow-md transition-shadow"
              >
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <value.icon className="h-7 w-7 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-lg font-bold text-text mb-2" data-role="heading-4">
                  {value.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed" data-role="subheading-2">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        heading="Stop by and meet us"
        subheading="No high-pressure tour. Just stop by during office hours and we'll show you around."
        primaryCta={{ label: "Find a location", href: "/storage-locations" }}
        phone={skinConfig.contactPhone}
      />
    </>
  );
}
