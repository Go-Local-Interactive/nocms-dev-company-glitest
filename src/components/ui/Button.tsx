import * as React from "react";

/**
 * Versatile button. Renders as either `<button>` or `<a>` (when `href` is set).
 * Ported from `storage-theme-payload`'s Button — same variant/size matrix,
 * minus the cva + Radix Slot dependencies (rewritten as plain className lookup).
 *
 * Editor contract: root tagged `data-nocms-component="button"`, accepts an
 * optional `data-role` for direct-edit (typically `"cta"`).
 */

export type ButtonVariant =
  | "primary"
  | "primary-light"
  | "outline-primary"
  | "secondary"
  | "secondary-light"
  | "outline-secondary"
  | "tertiary"
  | "tertiary-light"
  | "outline-tertiary"
  | "outline-ui"
  | "destructive"
  | "link"
  | "white"
  | "ghost"
  | "icon-only"
  | "gray";

export type ButtonSize = "default" | "sm" | "lg" | "icon" | "icon-md" | "icon-lg" | "clear";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white shadow-md hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 focus-visible:ring-primary",
  "primary-light":
    "bg-primary-light text-primary-dark hover:bg-primary hover:text-white focus-visible:ring-primary",
  "outline-primary":
    "border-2 border-primary text-primary hover:bg-primary hover:text-white focus-visible:ring-primary",
  secondary:
    "bg-secondary text-white shadow-md hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 focus-visible:ring-secondary",
  "secondary-light":
    "bg-secondary-light text-secondary-dark hover:bg-secondary hover:text-white focus-visible:ring-secondary",
  "outline-secondary":
    "border-2 border-secondary text-secondary hover:bg-secondary hover:text-white focus-visible:ring-secondary",
  tertiary: "bg-accent text-white hover:opacity-90 focus-visible:ring-accent",
  "tertiary-light":
    "bg-accent-light text-accent hover:bg-accent hover:text-white focus-visible:ring-accent",
  "outline-tertiary":
    "border-2 border-accent text-accent hover:bg-accent hover:text-white focus-visible:ring-accent",
  "outline-ui":
    "border border-text/20 text-text hover:bg-text/5 focus-visible:ring-text/30",
  destructive: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
  link: "text-primary underline-offset-4 hover:underline focus-visible:ring-primary",
  white:
    "bg-white text-primary-dark shadow-md hover:bg-background hover:shadow-lg focus-visible:ring-white",
  ghost: "text-text hover:bg-text/5 focus-visible:ring-text/30",
  "icon-only": "text-text hover:bg-text/5 focus-visible:ring-text/30",
  gray: "bg-text/10 text-text hover:bg-text/15 focus-visible:ring-text/30",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "px-6 py-3 text-base",
  sm: "px-4 py-2 text-sm",
  lg: "px-8 py-4 text-lg",
  icon: "h-9 w-9",
  "icon-md": "h-10 w-10",
  "icon-lg": "h-12 w-12",
  clear: "",
};

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement> & React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "type"> {
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: "button" | "submit" | "reset";
  isLoading?: boolean;
  "data-role"?: string;
}

export const Button: React.FC<ButtonProps> = ({
  className = "",
  variant = "primary",
  size = "default",
  href,
  type = "button",
  isLoading = false,
  children,
  "data-role": dataRole,
  ...props
}) => {
  const classes = `inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
    variantClasses[variant] ?? variantClasses.primary
  } ${sizeClasses[size] ?? sizeClasses.default} ${className}`;

  if (href) {
    return (
      <a
        data-nocms-component="button"
        data-role={dataRole}
        href={href}
        className={classes}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {isLoading && <span className="sr-only">Loading...</span>}
        {children}
      </a>
    );
  }

  return (
    <button
      data-nocms-component="button"
      data-role={dataRole}
      type={type}
      className={classes}
      disabled={isLoading || (props as React.ButtonHTMLAttributes<HTMLButtonElement>).disabled}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {isLoading && <span className="sr-only">Loading...</span>}
      {children}
    </button>
  );
};
