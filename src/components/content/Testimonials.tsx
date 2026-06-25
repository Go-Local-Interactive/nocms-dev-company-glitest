"use client";

import { useState, useRef, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

export interface Testimonial {
  quote: string;
  author: string;
  relationship?: string;
  rating?: number;
  image?: string;
}

interface TestimonialsProps {
  testimonials?: Testimonial[];
  variant?: "shelf" | "cards" | "single";
  heading?: string;
}

const defaultTestimonials: Testimonial[] = [
  {
    quote: "Moving Mom to this community was the best decision our family ever made. The staff treats every resident like family, and she has never been happier.",
    author: "Sarah Mitchell",
    relationship: "Daughter of Resident",
    rating: 5,
  },
  {
    quote: "I was nervous about giving up my home, but this community has given me a richer life than I ever imagined. The activities, the friendships, the care — it is truly exceptional.",
    author: "Robert Chen",
    relationship: "Resident since 2022",
    rating: 5,
  },
  {
    quote: "The memory care program gave us peace of mind we had not felt in years. Knowing Dad is safe, engaged, and cared for by trained professionals means everything.",
    author: "Jennifer Park",
    relationship: "Daughter of Memory Care Resident",
    rating: 5,
  },
  {
    quote: "What surprised me most was how vibrant life is here. Between the fitness classes, art workshops, and social events, my calendar is fuller than it was ten years ago.",
    author: "Margaret Torres",
    relationship: "Independent Living Resident",
    rating: 5,
  },
];

export function Testimonials({
  testimonials = defaultTestimonials,
  variant = "cards",
  heading = "What Families Are Saying",
}: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    if (variant !== "shelf") return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [variant, testimonials.length]);

  if (variant === "single") {
    const t = testimonials[currentIndex];
    return (
      <section data-nocms-component="testimonials" className="bg-surface py-16 lg:py-24" id="testimonials">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 data-role="heading" className="font-heading text-3xl font-bold text-text mb-10">{heading}</h2>
          <Quote className="h-10 w-10 text-primary/20 mx-auto mb-6" aria-hidden="true" />
          <blockquote>
            <p className="text-xl text-text leading-relaxed italic mb-6" data-role="subheading">
              &ldquo;{t.quote}&rdquo;
            </p>
            <footer>
              <div className="flex items-center justify-center gap-1 mb-3">
                {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
                ))}
              </div>
              <cite className="not-italic font-semibold text-text">{t.author}</cite>
              {t.relationship && (
                <p className="text-muted text-sm mt-1">{t.relationship}</p>
              )}
            </footer>
          </blockquote>
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="h-10 w-10 rounded-full border border-text/10 flex items-center justify-center hover:bg-surface transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5 text-text" />
            </button>
            <span className="text-sm text-muted">
              {currentIndex + 1} / {testimonials.length}
            </span>
            <button
              onClick={next}
              className="h-10 w-10 rounded-full border border-text/10 flex items-center justify-center hover:bg-surface transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5 text-text" />
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "shelf") {
    return (
      <section data-nocms-component="testimonials" className="bg-surface py-16 lg:py-24 overflow-hidden" id="testimonials">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">
          <h2 data-role="heading" className="font-heading text-3xl sm:text-4xl font-bold text-text text-center">{heading}</h2>
        </div>
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 px-4 transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 340}px)` }}
          >
            {(testimonials ?? []).map((t, i) => (
              <div
                key={i}
                className="min-w-[320px] max-w-[320px] bg-background rounded-xl p-6 shadow-sm border border-text/5"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating ?? 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-text text-sm leading-relaxed italic mb-4">&ldquo;{t.quote}&rdquo;</p>
                <p className="font-semibold text-text text-sm">{t.author}</p>
                {t.relationship && <p className="text-muted text-xs">{t.relationship}</p>}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={prev} className="h-10 w-10 rounded-full border border-text/10 flex items-center justify-center hover:bg-background transition-colors" aria-label="Previous">
              <ChevronLeft className="h-5 w-5 text-text" />
            </button>
            <button onClick={next} className="h-10 w-10 rounded-full border border-text/10 flex items-center justify-center hover:bg-background transition-colors" aria-label="Next">
              <ChevronRight className="h-5 w-5 text-text" />
            </button>
          </div>
        </div>
      </section>
    );
  }

  /* cards variant (default) */
  return (
    <section data-nocms-component="testimonials" className="bg-surface py-16 lg:py-24" id="testimonials">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 data-role="heading" className="font-heading text-3xl sm:text-4xl font-bold text-text text-center mb-12">{heading}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {(testimonials ?? []).map((t, i) => (
            <div
              key={i}
              className="bg-background rounded-xl p-8 shadow-sm border border-text/5 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating ?? 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
                ))}
              </div>
              <Quote className="h-6 w-6 text-primary/15 mb-3" aria-hidden="true" />
              <p className="text-text leading-relaxed italic mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                {t.image && (
                  <img src={t.image} alt={t.author} className="h-10 w-10 rounded-full object-cover" data-role="media" />
                )}
                <div>
                  <p className="font-semibold text-text text-sm">{t.author}</p>
                  {t.relationship && <p className="text-muted text-xs">{t.relationship}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
