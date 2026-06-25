"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Heart, Shield, Users, Sparkles, Clock, Award } from "lucide-react";

export interface WhyReason {
  icon?: string;
  title: string;
  description: string;
}

interface WhySectionProps {
  reasons?: WhyReason[];
  variant?: "carousel" | "grid";
  heading?: string;
  subtitle?: string;
}

const iconMap: Record<string, React.ElementType> = {
  heart: Heart,
  shield: Shield,
  users: Users,
  sparkles: Sparkles,
  clock: Clock,
  award: Award,
};

const defaultReasons: WhyReason[] = [
  {
    icon: "heart",
    title: "Compassionate Care",
    description: "Our trained staff provides personalized attention with genuine warmth, treating every resident as family.",
  },
  {
    icon: "shield",
    title: "Safety & Security",
    description: "24/7 nursing staff, emergency response systems, and secure environments give families peace of mind.",
  },
  {
    icon: "users",
    title: "Vibrant Community",
    description: "200+ monthly activities, clubs, outings, and social events keep residents engaged and connected.",
  },
  {
    icon: "sparkles",
    title: "Premium Amenities",
    description: "Chef-prepared dining, fitness centers, spa services, gardens, and beautifully designed living spaces.",
  },
  {
    icon: "clock",
    title: "Continuum of Care",
    description: "Seamless transitions between independent, assisted, and memory care as needs evolve over time.",
  },
  {
    icon: "award",
    title: "Proven Excellence",
    description: "Consistently rated among the top senior living communities with industry-leading satisfaction scores.",
  },
];

export function WhySection({
  reasons = defaultReasons,
  variant = "grid",
  heading = "Why Families Choose Us",
  subtitle = "Discover what makes our community the right choice for your loved one.",
}: WhySectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const next = () => setCurrentIndex((prev) => (prev + 1) % reasons.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + reasons.length) % reasons.length);

  if (variant === "carousel") {
    const reason = reasons[currentIndex];
    const Icon = iconMap[reason.icon ?? "heart"] ?? Heart;

    return (
      <section data-nocms-component="why-section" className="bg-surface py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 data-role="heading" className="font-heading text-3xl sm:text-4xl font-bold text-text mb-4">{heading}</h2>
          {subtitle && <p className="text-muted mb-12">{subtitle}</p>}

          <div className="bg-background rounded-2xl p-10 shadow-sm border border-text/5 min-h-[240px] flex flex-col items-center justify-center">
            <div className="h-16 w-16 rounded-2xl bg-primary-light flex items-center justify-center mb-6">
              <Icon className="h-8 w-8 text-primary" aria-hidden="true" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-text mb-3">{reason.title}</h3>
            <p className="text-muted max-w-lg leading-relaxed" data-role="subheading">{reason.description}</p>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={prev} className="h-10 w-10 rounded-full border border-text/10 flex items-center justify-center hover:bg-background transition-colors" aria-label="Previous reason">
              <ChevronLeft className="h-5 w-5 text-text" />
            </button>
            <div className="flex gap-2">
              {reasons.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentIndex ? "w-6 bg-primary" : "w-2 bg-text/20"
                  }`}
                  aria-label={`Go to reason ${i + 1}`}
                />
              ))}
            </div>
            <button onClick={next} className="h-10 w-10 rounded-full border border-text/10 flex items-center justify-center hover:bg-background transition-colors" aria-label="Next reason">
              <ChevronRight className="h-5 w-5 text-text" />
            </button>
          </div>
        </div>
      </section>
    );
  }

  /* grid variant (default) */
  return (
    <section data-nocms-component="why-section" className="bg-surface py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 data-role="heading" className="font-heading text-3xl sm:text-4xl font-bold text-text mb-4">{heading}</h2>
          {subtitle && <p className="text-muted text-lg max-w-2xl mx-auto">{subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(reasons ?? []).map((reason) => {
            const Icon = iconMap[reason.icon ?? "heart"] ?? Heart;
            return (
              <div data-nocms-component="why-section"
                key={reason.title}
                className="bg-background rounded-xl p-8 border border-text/5 hover:shadow-md transition-shadow"
              >
                <div className="h-14 w-14 rounded-xl bg-primary-light flex items-center justify-center mb-5">
                  <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-lg font-bold text-text mb-2">{reason.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{reason.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
