import type { Metadata } from "next";
import { CTABanner } from "@/components/content/CTABanner";
import { FacilityCards } from "@/components/facility/FacilityCards";
import { SizeGuide } from "@/components/content/SizeGuide";
import { listFacilities } from "@/lib/facilities/loader";
import { fetchAllLocations } from "@/lib/payload";
import { fmsBackedCardFacilities } from "@/lib/locations";
import skinConfig from "@/skin.config";

export const metadata: Metadata = {
  title: `Reserve a unit | ${skinConfig.brandName}`,
  description: `Reserve a storage unit at ${skinConfig.brandName}. Hold today's rate — no payment due now.`,
};

export default async function ReserveOnlinePage() {
  const [locations, fms] = await Promise.all([fetchAllLocations(), listFacilities()]);
  // Locations without FMS data are skipped: there is nothing to reserve online.
  const facilities = fmsBackedCardFacilities(locations, fms);

  return (
    <>
      <section
        data-nocms-component="reserve-online-hero"
        className="bg-primary py-16 lg:py-20 text-center text-white"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1
            data-role="heading"
            className="font-heading text-4xl sm:text-5xl font-bold leading-tight"
          >
            Reserve your unit
          </h1>
          <p data-role="subheading" className="mt-4 text-lg text-white/85">
            Lock in today&apos;s rate online. We&apos;ll hold the unit for up to seven days — no payment due now.
          </p>
          <a
            data-role="cta"
            href="#pick-location"
            className="mt-8 inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-md text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            Pick a location
          </a>
        </div>
      </section>

      <section
        id="pick-location"
        className="py-16 lg:py-20 bg-background"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-text text-center mb-10" data-role="heading-2">
            Pick a location to reserve
          </h2>
          <FacilityCards facilities={facilities} />
        </div>
      </section>

      <SizeGuide />

      <CTABanner
        heading="Still not sure which size?"
        subheading="We've helped thousands of customers right-size their storage. Call us or browse the size guide."
        primaryCta={{ label: "Contact us", href: "/contact" }}
        phone={skinConfig.contactPhone}
      />
    </>
  );
}
