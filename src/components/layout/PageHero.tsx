"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Search } from "lucide-react";

interface HeroCta {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
}

interface PageHeroProps {
  variant?: "video" | "search" | "image" | "simple";
  title: string;
  subtitle?: string;
  ctas?: HeroCta[];
  backgroundImage?: string;
  videoSrcs?: string[];
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
}

export function PageHero({
  variant = "image",
  title,
  subtitle,
  ctas = [],
  backgroundImage = "https://images.unsplash.com/photo-1559234938-b60fff04894d?w=1600&q=80",
  videoSrcs = [],
  searchPlaceholder = "Search our community...",
  onSearch,
}: PageHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (variant !== "video" || videoSrcs.length === 0) return;
    const el = videoRef.current;
    if (!el) return;
    el.src = videoSrcs[0];
    el.load();
    el.play().then(() => setVideoReady(true)).catch(() => {});
  }, [variant, videoSrcs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const isSimple = variant === "simple";

  return (
    <section
      data-nocms-component="page-hero"
      className={
        isSimple
          ? "bg-primary py-16 lg:py-24 text-center"
          : "relative min-h-[75vh] flex items-center justify-center text-center overflow-hidden"
      }
    >
      {!isSimple && (
        <>
          <img
            src={backgroundImage}
            alt=""
            data-role="media"
            className="absolute inset-0 w-full h-full object-cover z-0"
            loading="eager"
            role="presentation"
          />
          {variant === "video" && videoSrcs.length > 0 && (
            <video
              ref={videoRef}
              className={`absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover z-[1] hidden md:block motion-reduce:hidden transition-opacity duration-1000 ${
                videoReady ? "opacity-100" : "opacity-0"
              }`}
              muted
              playsInline
              loop
              aria-hidden="true"
            />
          )}
          <div className="absolute inset-0 z-[2] bg-gradient-to-b from-text/60 via-text/50 to-text/70" />
        </>
      )}

      <div
        className={
          isSimple
            ? "mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"
            : "relative z-[3] max-w-3xl px-6 sm:px-10 py-16"
        }
      >
        <h1
          data-role="heading"
          className={
            isSimple
              ? "font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight whitespace-pre-line"
              : "font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6 whitespace-pre-line"
          }
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            data-role="subheading"
            className={
              isSimple
                ? "mt-4 text-lg text-white/85 max-w-2xl mx-auto"
                : "text-lg sm:text-xl text-white/90 leading-relaxed mb-8 max-w-2xl mx-auto font-body"
            }
            style={isSimple ? undefined : ({ textWrap: "balance" } as React.CSSProperties)}
          >
            {subtitle}
          </p>
        )}

        {variant === "search" && (
          <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-12 pr-4 py-4 rounded-lg bg-white text-text text-base shadow-xl focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Search"
              />
            </div>
          </form>
        )}

        {ctas.length > 0 && (
          <div className={isSimple ? "flex flex-col sm:flex-row items-center justify-center gap-4 mt-8" : "flex flex-col sm:flex-row items-center justify-center gap-4"}>
            {ctas.map((cta, idx) => (
              <a
                key={cta.href}
                href={cta.href}
                data-role={idx === 0 ? "cta" : undefined}
                className={`inline-flex items-center gap-2 font-semibold rounded-md transition-all ${
                  isSimple
                    ? `px-6 py-3 text-base ${
                        cta.variant === "secondary"
                          ? "border-2 border-white/50 text-white hover:bg-white hover:text-primary"
                          : "bg-accent text-white shadow-lg hover:opacity-90 hover:shadow-xl hover:-translate-y-0.5"
                      }`
                    : `px-8 py-4 text-lg ${
                        cta.variant === "secondary"
                          ? "border-2 border-white/50 text-white hover:bg-white hover:text-primary"
                          : "bg-secondary text-white shadow-lg shadow-secondary/30 hover:shadow-xl hover:-translate-y-0.5"
                      }`
                }`}
              >
                {cta.label}
                {cta.variant !== "secondary" && (
                  <ArrowRight className={isSimple ? "h-4 w-4" : "h-5 w-5"} aria-hidden="true" />
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
