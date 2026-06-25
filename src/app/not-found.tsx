import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "The page you're looking for can't be found. It may have been moved or deleted.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section
      data-nocms-component="not-found"
      className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center"
      aria-labelledby="not-found-heading"
    >
      <p className="text-7xl font-heading font-bold text-primary leading-none">404</p>
      <h1
        id="not-found-heading"
        data-role="heading"
        className="mt-4 font-heading text-3xl font-bold text-text"
      >
        Page not found
      </h1>
      <p data-role="subheading" className="mt-3 text-lg text-muted max-w-md">
        The page you&apos;re looking for can&apos;t be found. It may have been moved or deleted.
      </p>
      <div className="mt-8">
        <Button href="/" variant="primary" data-role="cta">
          Return home
        </Button>
      </div>
    </section>
  );
}
