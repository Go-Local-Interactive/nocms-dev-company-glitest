import type { Metadata } from "next";
import { CTABanner } from "@/components/content/CTABanner";
import { RentalSteps } from "@/components/storage/RentalSteps";
import { FacilityCards } from "@/components/facility/FacilityCards";
import { listFacilities } from "@/lib/facilities/loader";
import { fetchAllLocations } from "@/lib/payload";
import { fmsBackedCardFacilities } from "@/lib/locations";
import skinConfig from "@/skin.config";

export const metadata: Metadata = {
  title: `Rent online | ${skinConfig.brandName}`,
  description: `Sign your lease and move in the same day. Online rentals from ${skinConfig.brandName}.`,
};

export default async function RentOnlinePage() {
  const [locations, fms] = await Promise.all([fetchAllLocations(), listFacilities()]);
  // Locations without FMS data are skipped: there is nothing to rent online.
  const facilities = fmsBackedCardFacilities(locations, fms);

  return (
    <>
      <section
        data-nocms-component="rent-online-hero"
        className="bg-primary py-16 lg:py-20 text-center text-white"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1
            data-role="heading"
            className="font-heading text-4xl sm:text-5xl font-bold leading-tight"
          >
            Rent online — move in today
          </h1>
          <p data-role="subheading" className="mt-4 text-lg text-white/85">
            Pick a unit, sign the lease, get your gate code — all without visiting the office.
          </p>
          <a
            data-role="cta"
            href="#facility-picker"
            className="mt-8 inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-md text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            Pick a location
          </a>
        </div>
      </section>

      <RentalSteps
        heading="Renting online is easy"
        steps={[
          { icon: "search", text: "Pick a location and unit size online." },
          { icon: "card", text: "Sign your lease and pay the first month from any device." },
          { icon: "key", text: "Receive your gate code by email — usually within minutes." },
          { icon: "boxes", text: "Move in any time during access hours." },
        ]}
      />

      <section
        id="facility-picker"
        className="py-16 lg:py-20 bg-surface"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-text text-center mb-10" data-role="heading-2">
            Pick a location
          </h2>
          <FacilityCards facilities={facilities} />
        </div>
      </section>

      <CTABanner
        heading="Need help picking a size?"
        subheading="Our team can talk you through what fits — call any time during office hours."
        primaryCta={{ label: "See size guide", href: "/size-guide" }}
        phone={skinConfig.contactPhone}
      />
    </>
  );
}
