import * as React from "react";

/**
 * Card primitive system. Ported from `storage-theme-payload`'s Card —
 * surface for blog posts, facility tiles, and default content panels. The
 * source supported a `date` prop (DateBadge) and a `promotion` overlay
 * (FacilityPromotion), both of which are now folded into a simple slot
 * convention: callers compose `CardImage` / `CardContent` / `CardFooter`
 * children themselves.
 *
 * Editor contract: root tagged `data-nocms-component="card"`. Subcomponents
 * stay untagged — the patcher resolves direct-edit roles on the subtree
 * (typically `heading` on `CardTitle`, `subheading` on `CardDescription`,
 * `cta` inside `CardFooter`).
 */

export type CardVariant = "default" | "blog" | "facility";
export type CardLayout = "default" | "horizontal";

interface CardProps extends React.HTMLAttributes<HTMLElement> {
  variant?: CardVariant;
  layout?: CardLayout;
  /** Required ARIA label for the card region. */
  ariaLabel: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  className = "",
  variant = "default",
  layout = "default",
  ariaLabel,
  children,
  ...props
}) => {
  const layoutClass = layout === "horizontal" ? "flex flex-row" : "flex flex-col";
  return (
    <article
      data-nocms-component="card"
      data-variant={variant}
      data-layout={layout}
      className={`group overflow-hidden rounded-lg bg-background border border-text/5 shadow-sm hover:shadow-lg transition-shadow ${layoutClass} ${className}`}
      tabIndex={0}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </article>
  );
};

function CardHeader({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`px-6 pt-6 ${className}`} {...props} />;
}

function CardTitle({ className = "", ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`font-heading text-xl font-bold text-text leading-tight ${className}`}
      {...props}
    />
  );
}

function CardDescription({ className = "", ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`text-sm text-muted leading-relaxed ${className}`} {...props} />;
}

function CardContent({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`px-6 py-4 flex-1 ${className}`} {...props} />;
}

function CardFooter({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`px-6 pb-6 pt-2 ${className}`} {...props} />;
}

interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

function CardImage({ className = "", src, alt, loading = "lazy", ...props }: CardImageProps) {
  return (
    <div className="relative overflow-hidden">
      <img
        src={src}
        alt={alt}
        loading={loading}
        className={`w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500 ${className}`}
        {...props}
      />
    </div>
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardImage };
export type { CardProps };
