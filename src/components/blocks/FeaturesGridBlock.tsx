import * as React from "react";
import { ShieldCheck, Thermometer, Truck, Camera, Clock, BadgeCheck } from "lucide-react";
import type { BlockProps } from "./types";
import { lexicalListItems } from "./Lexical";

const ICONS = [ShieldCheck, Thermometer, Truck, Camera, Clock, BadgeCheck];

/** Features grid — body lexical's bullet list maps to feature cards.
 *  Each item gets a deterministic icon by position. */
export function FeaturesGridBlock({ title, body }: BlockProps) {
  const items = lexicalListItems(body);
  if (items.length === 0) return null;
  return (
    <section data-nocms-component="features-grid" className="bg-background py-20 px-6 sm:px-10 lg:px-16">
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
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" data-payload-subfield="body">
          {items.map((text, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <li key={i} className="bg-surface rounded-xl p-7 border border-text/10 shadow-sm hover:shadow-md transition">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-5">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="font-body text-base text-muted leading-relaxed">{text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
