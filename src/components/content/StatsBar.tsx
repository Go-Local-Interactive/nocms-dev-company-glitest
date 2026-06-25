"use client";

import { useEffect, useRef, useState } from "react";

export interface Stat {
  value: string;
  label: string;
  suffix?: string;
}

interface StatsBarProps {
  stats?: Stat[];
  className?: string;
}

const defaultStats: Stat[] = [
  { value: "24/7", label: "Nursing Staff On-Site" },
  { value: "1:6", label: "Staff-to-Resident Ratio" },
  { value: "100", label: "Resident Satisfaction", suffix: "%" },
  { value: "15", label: "Years of Excellence", suffix: "+" },
];

export function StatsBar({ stats = defaultStats, className = "" }: StatsBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section data-nocms-component="stats-bar"
      ref={containerRef}
      className={`bg-primary-dark py-12 lg:py-16 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {(stats ?? []).map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <p className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2" data-role="heading">
                {stat.value}
                {stat.suffix && <span className="text-white/70">{stat.suffix}</span>}
              </p>
              <p className="text-white/75 text-sm font-medium uppercase tracking-wider" data-role="subheading">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
