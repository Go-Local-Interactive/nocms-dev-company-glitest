import * as React from "react";

/**
 * Static address block. Source: storage-theme-payload `src/components/Address`
 * — Layout-1 only (the link variant lived in Layout-2 and depended on Google
 * Place IDs / Maps deep links). Renders the parts as a plain `<address>`
 * element so consumers can drop it inside any contact card.
 *
 * Editor contract: root tagged `data-nocms-component="address"`. The street
 * line carries `data-role="subheading"` so the patcher can reach a meaningful
 * leaf when the consumer is being inspected; nothing else needs roles.
 */

interface AddressProps extends Omit<React.HTMLAttributes<HTMLElement>, "style"> {
  address1: string;
  address2?: string | null;
  city: string;
  state: string;
  zip: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "link";
}

const sizeClasses: Record<NonNullable<AddressProps["size"]>, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export function Address({
  address1,
  address2,
  city,
  state,
  zip,
  size = "md",
  variant = "default",
  className = "",
  ...rest
}: AddressProps) {
  const variantClass = variant === "link" ? "hover:underline decoration-current" : "";
  return (
    <address
      data-nocms-component="address"
      className={`not-italic ${sizeClasses[size]} ${variantClass} ${className}`}
      {...rest}
    >
      {address1 && (
        <>
          <span data-role="subheading">{address1}</span>
          <br />
        </>
      )}
      {address2 && (
        <span>
          {address2}
          <br />
        </span>
      )}
      {city && state && (
        <span>
          {city}, {state} {zip}
        </span>
      )}
    </address>
  );
}

export type { AddressProps };
export default Address;
