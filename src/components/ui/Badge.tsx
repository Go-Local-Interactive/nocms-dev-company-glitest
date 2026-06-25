import * as React from "react";

/**
 * Compact pill label. Used by storage-theme components like FacilityCard
 * (promotion badge), SizeGuide (capacity badge), and BlogCard (category
 * badge). Plain `<span>` — no Radix/CVA dependency.
 *
 * Editor contract: root tagged `data-nocms-component="badge"`. Optional
 * `data-role` is forwarded so callers can mark this as e.g. a `cta` leaf.
 */
export type BadgeVariant = "primary" | "secondary" | "accent" | "muted" | "outline";

interface BadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  "data-role"?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: "bg-primary-light text-primary-dark",
  secondary: "bg-secondary-light text-secondary-dark",
  accent: "bg-accent-light text-accent",
  muted: "bg-text/5 text-muted",
  outline: "border border-text/15 text-text bg-transparent",
};

export function Badge({
  children,
  variant = "primary",
  className = "",
  "data-role": dataRole,
  ...rest
}: BadgeProps) {
  return (
    <span
      data-nocms-component="badge"
      data-role={dataRole}
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
        variantClasses[variant] ?? variantClasses.primary
      } ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}
