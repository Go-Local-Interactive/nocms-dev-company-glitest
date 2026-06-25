"use client";

import * as React from "react";

/**
 * Carousel primitive. Source uses Embla; we re-implement the same compositional
 * API (`Carousel` + `CarouselContent` + `CarouselItem` + `CarouselPrevious` +
 * `CarouselNext`) on top of a plain scroll container with snap points so we
 * don't pull a third-party dep into the template baseline.
 *
 * Editor contract: root tagged `data-nocms-component="carousel"`. Slides are
 * wrappers — direct-edit roles live on whatever the caller renders inside.
 */

type Orientation = "horizontal" | "vertical";

type CarouselContextValue = {
  orientation: Orientation;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  registerSlideCount: (count: number) => void;
};

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

function useCarousel(): CarouselContextValue {
  const ctx = React.useContext(CarouselContext);
  if (!ctx) throw new Error("useCarousel must be used within a <Carousel />");
  return ctx;
}

interface CarouselProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onScroll"> {
  orientation?: Orientation;
  loop?: boolean;
}

export const Carousel: React.FC<CarouselProps> = ({
  orientation = "horizontal",
  loop = false,
  className = "",
  children,
  ...props
}) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);
  const [, setSlideCount] = React.useState(0);

  const update = React.useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (orientation === "horizontal") {
      setCanScrollPrev(el.scrollLeft > 0);
      setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    } else {
      setCanScrollPrev(el.scrollTop > 0);
      setCanScrollNext(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
    }
  }, [orientation]);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scrollBy = React.useCallback(
    (direction: 1 | -1) => {
      const el = containerRef.current;
      if (!el) return;
      const stride =
        orientation === "horizontal" ? el.clientWidth : el.clientHeight;
      const before =
        orientation === "horizontal" ? el.scrollLeft : el.scrollTop;
      const max =
        orientation === "horizontal"
          ? el.scrollWidth - el.clientWidth
          : el.scrollHeight - el.clientHeight;
      let target = before + direction * stride;
      if (loop) {
        if (target > max + 1) target = 0;
        if (target < 0) target = max;
      }
      el.scrollTo(
        orientation === "horizontal"
          ? { left: target, behavior: "smooth" }
          : { top: target, behavior: "smooth" },
      );
    },
    [orientation, loop],
  );

  const scrollPrev = React.useCallback(() => scrollBy(-1), [scrollBy]);
  const scrollNext = React.useCallback(() => scrollBy(1), [scrollBy]);

  const registerSlideCount = React.useCallback((count: number) => {
    setSlideCount(count);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (orientation === "horizontal") {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      scrollPrev();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      scrollNext();
    }
  };

  return (
    <CarouselContext.Provider
      value={{
        orientation,
        scrollPrev,
        scrollNext,
        canScrollPrev: loop || canScrollPrev,
        canScrollNext: loop || canScrollNext,
        containerRef,
        registerSlideCount,
      }}
    >
      <div
        data-nocms-component="carousel"
        role="region"
        aria-roledescription="carousel"
        onKeyDown={handleKeyDown}
        className={`relative ${className}`}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
};

export function CarouselContent({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { containerRef, orientation, registerSlideCount } = useCarousel();

  React.useEffect(() => {
    registerSlideCount(React.Children.count(children));
  }, [children, registerSlideCount]);

  const axisClass =
    orientation === "horizontal"
      ? "flex flex-row overflow-x-auto snap-x snap-mandatory scrollbar-none"
      : "flex flex-col overflow-y-auto snap-y snap-mandatory scrollbar-none max-h-full";

  return (
    <div
      ref={containerRef}
      className={`${axisClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CarouselItem({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { orientation } = useCarousel();
  const axisClass =
    orientation === "horizontal"
      ? "min-w-0 shrink-0 grow-0 basis-full snap-start"
      : "min-h-0 shrink-0 grow-0 basis-full snap-start";
  return (
    <div
      role="group"
      aria-roledescription="slide"
      className={`${axisClass} ${className}`}
      {...props}
    />
  );
}

interface CarouselNavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  position?: "inner" | "outer";
}

export function CarouselPrevious({
  className = "",
  position = "outer",
  ...props
}: CarouselNavButtonProps) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  const positionClass =
    position === "outer"
      ? orientation === "horizontal"
        ? "absolute top-1/2 -left-12 -translate-y-1/2"
        : "absolute -top-12 left-1/2 -translate-x-1/2 rotate-90"
      : orientation === "horizontal"
        ? "absolute top-1/2 left-4 -translate-y-1/2"
        : "absolute top-4 left-1/2 -translate-x-1/2 rotate-90";

  return (
    <button
      type="button"
      onClick={scrollPrev}
      disabled={!canScrollPrev}
      aria-label="Previous slide"
      className={`${positionClass} z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-text shadow-md hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className}`}
      {...props}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="15 18 9 12 15 6" />
      </svg>
      <span className="sr-only">Previous slide</span>
    </button>
  );
}

export function CarouselNext({
  className = "",
  position = "outer",
  ...props
}: CarouselNavButtonProps) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  const positionClass =
    position === "outer"
      ? orientation === "horizontal"
        ? "absolute top-1/2 -right-12 -translate-y-1/2"
        : "absolute -bottom-12 left-1/2 -translate-x-1/2 rotate-90"
      : orientation === "horizontal"
        ? "absolute top-1/2 right-4 -translate-y-1/2"
        : "absolute bottom-4 left-1/2 -translate-x-1/2 rotate-90";

  return (
    <button
      type="button"
      onClick={scrollNext}
      disabled={!canScrollNext}
      aria-label="Next slide"
      className={`${positionClass} z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-text shadow-md hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className}`}
      {...props}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="9 18 15 12 9 6" />
      </svg>
      <span className="sr-only">Next slide</span>
    </button>
  );
}
