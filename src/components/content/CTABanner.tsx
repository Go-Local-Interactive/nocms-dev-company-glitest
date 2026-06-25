import * as React from "react";
import { ArrowRight, Phone } from "lucide-react";
import { RichText } from "@/components/ui/RichText";

/**
 * CTA banner — heading + optional subheading + primary/secondary CTAs +
 * optional phone link. Source: storage-theme-payload `src/blocks/CallToAction`.
 * Replaces the upstream Lexical `richText` block + `links[]` array with a
 * pair of simple `{label, href}` props and a plain-string `subheading` fed to
 * the RichText shim.
 *
 * Editor contract: heading carries `data-role="heading"`, subheading wrapper
 * is plain (RichText is generic), primary CTA carries `data-role="cta"`.
 */

interface CtaButton {
  label: string;
  href: string;
}

interface CTABannerProps {
  heading: string;
  subheading?: string;
  primaryCta?: CtaButton;
  secondaryCta?: CtaButton;
  phone?: string;
  variant?: "primary" | "dark" | "accent";
}

const variantClasses: Record<string, string> = {
  primary: "bg-primary text-white",
  dark: "bg-text text-white",
  accent: "bg-accent text-white",
};

export function CTABanner({
  heading,
  subheading,
  primaryCta = { label: "Reserve a unit", href: "/reserve" },
  secondaryCta,
  phone,
  variant = "primary",
}: CTABannerProps) {
  return (
    <section
      data-nocms-component="cta-banner"
      className={`py-16 lg:py-20 ${variantClasses[variant] ?? variantClasses.primary}`}
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2
          data-role="heading"
          className="font-heading text-3xl sm:text-4xl font-bold mb-4"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          {heading}
        </h2>
        {subheading && (
          <div className="text-white/85 text-lg mb-8 max-w-2xl mx-auto">
            <RichText source={subheading} />
          </div>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={primaryCta.href}
            data-role="cta"
            className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-md text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            {primaryCta.label}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          {secondaryCta && (
            <a
              href={secondaryCta.href}
              className="inline-flex items-center gap-2 border-2 border-white/50 text-white font-semibold px-8 py-4 rounded-md text-base hover:bg-white/10 transition-all"
            >
              {secondaryCta.label}
            </a>
          )}
          {phone && (
            <a
              href={`tel:${phone.replace(/[^\d+]/g, "")}`}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white font-semibold transition-colors"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              {phone}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
