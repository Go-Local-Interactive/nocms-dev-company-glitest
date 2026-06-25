import * as React from "react";
import { RichText } from "@/components/ui/RichText";
import { Button } from "@/components/ui/Button";

/**
 * Standard content block — eyebrow + heading + Markdown body + optional CTA.
 *
 * Source: storage-theme-payload `src/blocks/ContentBlock`. The upstream rendered
 * a multi-column Lexical-driven layout; here we collapse to a single editorial
 * column with plain-string body fed to the RichText shim.
 */

type Cta = { label: string; href: string };

interface ContentBlockProps {
  eyebrow?: string;
  heading?: string;
  body?: string;
  cta?: Cta;
  align?: "left" | "center";
}

export function ContentBlock({
  eyebrow,
  heading,
  body,
  cta,
  align = "left",
}: ContentBlockProps) {
  const alignClasses = align === "center" ? "text-center mx-auto" : "";
  return (
    <section
      data-nocms-component="content-block"
      className="py-16 lg:py-20"
    >
      <div className={`mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 ${alignClasses}`}>
        {eyebrow && (
          <div className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
            {eyebrow}
          </div>
        )}
        {heading && (
          <h2
            data-role="heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-text mb-6"
          >
            {heading}
          </h2>
        )}
        {body && (
          <div className="text-muted leading-relaxed text-lg space-y-4">
            <RichText source={body} />
          </div>
        )}
        {cta && (
          <div className="mt-8">
            <Button href={cta.href} data-role="cta" variant="primary" size="lg">
              {cta.label}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
