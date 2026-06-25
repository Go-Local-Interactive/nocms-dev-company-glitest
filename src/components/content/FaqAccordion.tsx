import * as React from "react";
import { RichText } from "@/components/ui/RichText";

/**
 * FAQ accordion — uses native `<details>`/`<summary>` so it stays SSR/RSC-safe
 * with no client JS. Source: storage-theme-payload `src/blocks/FaqBlock` +
 * `src/components/FaqAccordion`. Replaces the previous senior-living shape.
 *
 * Editor contract: section heading carries `data-role="heading"`; individual
 * FAQ items have no roles (one-role-per-component rule across the section).
 */

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  heading?: string;
  faqs?: FaqItem[];
  includeFaqSchema?: boolean;
}

const defaultFaqs: FaqItem[] = [
  {
    question: "What size storage unit do I need?",
    answer:
      "It depends on what you're storing. A 5x5 fits a closet's worth of boxes, a 10x10 holds a one-bedroom apartment, and a 10x20 covers a small house or garage. Use our size guide for a closer match.",
  },
  {
    question: "Are there any long-term contracts?",
    answer:
      "No. We rent month-to-month so you can stay as long or as short as you need. Cancel any time with notice.",
  },
  {
    question: "Is my unit secure?",
    answer:
      "Every facility has 24/7 video surveillance, gated access with a unique PIN, and well-lit grounds. You bring your own lock.",
  },
];

export function FaqAccordion({
  heading = "Frequently Asked Questions",
  faqs = defaultFaqs,
  includeFaqSchema = false,
}: FaqAccordionProps) {
  if (!faqs.length) return null;

  const schema = includeFaqSchema
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  return (
    <section data-nocms-component="faq-accordion" className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            data-role="heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-text"
          >
            {heading}
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details
              key={`${faq.question}-${i}`}
              className="group bg-surface rounded-lg border border-text/5 overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden hover:bg-background/50 transition-colors">
                <span className="font-semibold text-text">{faq.question}</span>
                <svg
                  className="h-5 w-5 text-muted shrink-0 transition-transform duration-200 group-open:rotate-180"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <div className="px-6 pb-5 text-muted leading-relaxed">
                <RichText source={faq.answer} />
              </div>
            </details>
          ))}
        </div>
        {schema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        )}
      </div>
    </section>
  );
}
