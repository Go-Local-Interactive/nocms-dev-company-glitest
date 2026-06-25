import * as React from "react";
import { Quote, Star } from "lucide-react";
import type { BlockProps } from "./types";
import { lexicalToText } from "./Lexical";

/** Single testimonial — title = author name, body = quote. */
export function TestimonialBlock({ title, body }: BlockProps) {
  const quote = lexicalToText(body);
  if (!quote) return null;
  return (
    <section data-nocms-component="testimonial" className="bg-background py-20 px-6 sm:px-10 lg:px-16">
      <div className="max-w-3xl mx-auto text-center">
        <Quote className="h-10 w-10 text-primary/30 mx-auto mb-6" aria-hidden="true" />
        <p
          data-payload-subfield="body"
          className="font-heading text-2xl sm:text-3xl text-text leading-relaxed mb-8"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          &ldquo;{quote}&rdquo;
        </p>
        <div className="flex items-center justify-center gap-1 mb-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" aria-hidden="true" />
          ))}
        </div>
        {title && (
          <p data-payload-subfield="title" className="font-body text-base font-semibold text-muted">
            {title}
          </p>
        )}
      </div>
    </section>
  );
}
