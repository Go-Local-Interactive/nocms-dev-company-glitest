import * as React from "react";
import { Search, ClipboardCheck, KeyRound, type LucideIcon } from "lucide-react";
import type { BlockProps } from "./types";
import { lexicalListItems } from "./Lexical";

/** Deterministic icon fallback by step position (used when a step has no
 *  enriched icon, or for pre-enrichment imports). */
const FALLBACK = [Search, ClipboardCheck, KeyRound];

/** Map a normalized legacy step-icon slug → lucide. Legacy steps use magnifier /
 *  clipboard-or-file / key; unknown slugs fall back to the positional icon. */
const ICON_MAP: Record<string, LucideIcon> = {
  "magnifying-glass": Search,
  search: Search,
  "file-lines": ClipboardCheck,
  "clipboard-list": ClipboardCheck,
  "clipboard-check": ClipboardCheck,
  file: ClipboardCheck,
  key: KeyRound,
};

/** Rental steps — mirrors legacy storage-theme-payload RentalSteps (Layout 2):
 *  a centered heading over a 3-up grid of horizontal gray cards (no connector
 *  line). Each card pairs a white icon tile (left) with a "STEP N" eyebrow over
 *  a bold step title (right).
 *
 *  Enriched import: `items[]` carries each step (icon slug + step text label).
 *  Falls back to the ordered list in `body` + positional icons for older imports.
 *
 *  Token mapping note: legacy uses a light-gray card (#fafafa) with a WHITE icon
 *  tile (#fff). In this theme `bg-surface` is the gray and `bg-background` is
 *  white — so the CARD is `bg-surface` and the icon tile is `bg-background`. */
export function RentalStepsBlock({ title, body, items }: BlockProps) {
  const enriched = (items ?? []).filter((it) => it.label || it.icon);
  const steps =
    enriched.length > 0
      ? enriched.map((it) => ({ text: it.label ?? "", iconSlug: it.icon ?? null }))
      : lexicalListItems(body).map((text) => ({ text, iconSlug: null as string | null }));
  if (steps.length === 0) return null;

  return (
    // legacy Layout-2: section sits on the page's white background; vertical margins only.
    <section data-nocms-component="rental-steps" className="my-10 lg:my-16 px-4 md:px-10">
      {title && (
        <h2
          data-role="heading"
          data-payload-subfield="title"
          className="font-heading text-2xl md:text-[2rem] font-bold text-text text-center mb-10 md:mb-14"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          {title}
        </h2>
      )}
      <div className="max-w-[1280px] mx-auto">
        <ol
          data-role="steps"
          data-payload-subfield={enriched.length ? "items" : "body"}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 m-0 p-0 list-none"
        >
          {steps.map((step, i) => {
            const Icon = (step.iconSlug && ICON_MAP[step.iconSlug]) || FALLBACK[i % FALLBACK.length];
            const stepNumber = i + 1;
            return (
              <li
                key={i}
                className="flex flex-row items-center gap-4 bg-surface rounded-lg p-6 md:p-8"
                aria-label={`Step ${stepNumber}: ${step.text}`}
              >
                {/* legacy icon tile: 56x56 white rounded square, centered primary icon (~32px) */}
                <div
                  aria-hidden="true"
                  className="flex items-center justify-center shrink-0 w-14 h-14 rounded-lg bg-background text-primary"
                >
                  <Icon className="h-8 w-8" />
                </div>
                <div className="flex flex-col">
                  <span className="font-body text-sm font-bold uppercase tracking-[0.35px] text-text mb-1">
                    {`Step ${stepNumber}`}
                  </span>
                  <p className="font-body text-2xl font-bold text-text m-0 leading-snug" data-role="subheading">{step.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
