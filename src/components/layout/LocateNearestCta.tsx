import Link from "next/link";

export function LocateNearestCta({ brandName, indexHref }: { brandName: string; indexHref: string }) {
  return (
    <section className="bg-secondary/90 text-white" data-nocms-component="locate-nearest-cta">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-heading text-xl sm:text-2xl font-bold text-center sm:text-left" data-role="subheading">
          Locate the Nearest {brandName} Available in Your Area
        </p>
        <Link
          href={indexHref}
          className="inline-flex items-center bg-primary text-white font-semibold px-6 py-3 rounded-md whitespace-nowrap hover:opacity-90 transition"
        >
          View All Locations
        </Link>
      </div>
    </section>
  );
}
