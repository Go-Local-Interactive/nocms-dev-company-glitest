import * as React from "react";
import { Search, ClipboardCheck, KeyRound } from "lucide-react";
import type { BlockProps } from "./types";
import { lexicalListItems } from "./Lexical";

const ICONS = [Search, ClipboardCheck, KeyRound];

/** Rental steps — body lexical's ordered list maps to numbered step cards.
 *  Up to 3 items get icons; the rest render as plain numbered cards. */
export function RentalStepsBlock({ title, body }: BlockProps) {
  const steps = lexicalListItems(body);
  if (steps.length === 0) return null;
  return (
    <section data-nocms-component="rental-steps" className="bg-surface py-20 px-6 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {title && (
          <h2
            data-payload-subfield="title"
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-text text-center mb-16"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {title}
          </h2>
        )}
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-8" data-payload-subfield="body">
          {steps.map((text, i) => {
            const Icon = ICONS[i] ?? Search;
            return (
              <li key={i} className="relative flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center mb-6 shadow-lg">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <div className="absolute top-0 right-0 lg:right-auto lg:-translate-x-20 text-7xl font-heading font-bold text-primary/10 leading-none select-none">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <p className="font-body text-base text-muted leading-relaxed max-w-xs">{text}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
